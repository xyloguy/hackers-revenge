package models

import (
	"fmt"
	"log"
	"math/rand"
	"sync"

	"gorm.io/gorm"
)

const (
	BattleMultiplier     = 5
	MaxConcurrentBattles = 20 // Compute battles concurrently in memory, then batch write to DB
)

// BattleRunner is an interface for running battles
type BattleRunner interface {
	RunAndSaveBattle(battle *Battle) error
	RunBattleInMemory(battle *Battle) error
	SaveBattlesBatch(battles []*Battle) error
}

// Match represents the logic for running a match between contenders and top players
type Match struct {
	DB           *gorm.DB
	BattleRunner BattleRunner
}

// NewMatch creates a new match runner
func NewMatch(db *gorm.DB, battleRunner BattleRunner) *Match {
	return &Match{
		DB:           db,
		BattleRunner: battleRunner,
	}
}

// RunFullTournament executes matches for the top 20 players with programs
// Uses concurrent in-memory battle computation followed by batch database write
func (m *Match) RunFullTournament() error {
	// Get top 20 players with programs (ordered by current place/score)
	var players []Player
	if err := m.DB.Where("last_program_id IS NOT NULL").
		Order("COALESCE(place, 999999), score DESC, id").
		Limit(20).
		Preload("LastProgram.Instructions").
		Preload("LastProgram.Player").
		Find(&players).Error; err != nil {
		return fmt.Errorf("failed to load players: %w", err)
	}

	if len(players) == 0 {
		return fmt.Errorf("no players with programs found")
	}

	log.Printf("Starting tournament with top %d players", len(players))

	// Reset all players' points
	for i := range players {
		players[i].ResetPoints()
	}

	// Prepare list of battles to run (every player vs every other player)
	type battlePair struct {
		p1, p2 int
	}
	battlesToRun := make([]battlePair, 0)
	for i := range players {
		for j := range players {
			if i != j {
				battlesToRun = append(battlesToRun, battlePair{i, j})
			}
		}
	}

	// Shuffle battles for random order
	rand.Shuffle(len(battlesToRun), func(i, j int) {
		battlesToRun[i], battlesToRun[j] = battlesToRun[j], battlesToRun[i]
	})

	// Calculate concurrency level
	totalBattles := len(battlesToRun) * BattleMultiplier
	concurrentBattles := MaxConcurrentBattles
	if totalBattles < concurrentBattles {
		concurrentBattles = totalBattles
	}
	if concurrentBattles < 1 {
		concurrentBattles = 1
	}

	log.Printf("Computing %d battles with %d concurrent workers (in-memory)", totalBattles, concurrentBattles)

	// Collect all computed battles
	var battlesMu sync.Mutex
	allBattles := make([]*Battle, 0, totalBattles)

	// Collect player stats updates
	type statsUpdate struct {
		playerIdx int
		wins      int
		losses    int
		ties      int
	}
	var statsMu sync.Mutex
	statsUpdates := make([]statsUpdate, 0, totalBattles*2)

	// Run battles concurrently in memory
	var wg sync.WaitGroup
	errChan := make(chan error, totalBattles)
	battleChan := make(chan battlePair, totalBattles)

	// Start worker goroutines
	for i := 0; i < concurrentBattles; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for pair := range battleChan {
				p1 := &players[pair.p1]
				p2 := &players[pair.p2]

				// Create battle structure with pre-loaded program data
				battle := &Battle{
					Program1ID: *p1.LastProgramID,
					Program2ID: *p2.LastProgramID,
					Program1:   p1.LastProgram,
					Program2:   p2.LastProgram,
				}

				// Compute battle in memory (no DB operations)
				if err := m.BattleRunner.RunBattleInMemory(battle); err != nil {
					errChan <- fmt.Errorf("failed to compute battle: %w", err)
					return
				}

				// Collect battle for batch write
				battlesMu.Lock()
				allBattles = append(allBattles, battle)
				battlesMu.Unlock()

				// Collect stats updates
				var update1, update2 statsUpdate
				update1.playerIdx = pair.p1
				update2.playerIdx = pair.p2

				if battle.IsTie() {
					update1.ties = 1
					update2.ties = 1
				} else if battle.IsWinner1() {
					update1.wins = 1
					update2.losses = 1
				} else if battle.IsWinner2() {
					update2.wins = 1
					update1.losses = 1
				}

				statsMu.Lock()
				statsUpdates = append(statsUpdates, update1, update2)
				statsMu.Unlock()
			}
		}()
	}

	// Enqueue all battles
	for mult := 0; mult < BattleMultiplier; mult++ {
		for _, pair := range battlesToRun {
			battleChan <- pair
		}
	}
	close(battleChan)

	// Wait for all battles to complete
	wg.Wait()
	close(errChan)

	// Check for any errors
	if len(errChan) > 0 {
		return <-errChan
	}

	log.Printf("All battles computed, applying stats updates and saving to database...")

	// Apply stats updates to players
	for _, update := range statsUpdates {
		players[update.playerIdx].Wins += update.wins
		players[update.playerIdx].Losses += update.losses
		players[update.playerIdx].Ties += update.ties
	}

	// Update last battle IDs (use last battle from each player's perspective)
	if len(allBattles) > 0 {
		for i := range players {
			// Find last battle involving this player
			for j := len(allBattles) - 1; j >= 0; j-- {
				battle := allBattles[j]
				if battle.Program1ID == *players[i].LastProgramID || battle.Program2ID == *players[i].LastProgramID {
					// Battle IDs will be assigned during batch save, so we'll update this later
					break
				}
			}
		}
	}

	// Batch write all battles to database
	log.Printf("Saving %d battles to database in batch...", len(allBattles))
	if err := m.BattleRunner.SaveBattlesBatch(allBattles); err != nil {
		return fmt.Errorf("failed to save battles: %w", err)
	}

	// Update player last_battle_id with the actual saved battle IDs
	for i := range players {
		for j := len(allBattles) - 1; j >= 0; j-- {
			battle := allBattles[j]
			if battle.Program1ID == *players[i].LastProgramID || battle.Program2ID == *players[i].LastProgramID {
				if battle.ID > 0 {
					players[i].LastBattleID = &battle.ID
				}
				break
			}
		}
	}

	// Save all players
	log.Printf("Saving player stats...")
	for i := range players {
		if err := m.DB.Select("wins", "losses", "ties", "score", "last_battle_id", "last_program_id").Save(&players[i]).Error; err != nil {
			return fmt.Errorf("failed to save player: %w", err)
		}
	}

	// Get all player IDs for placement update
	playerIDs := make([]uint, len(players))
	for i, p := range players {
		playerIDs[i] = p.ID
	}

	// Update placements
	if err := m.updatePlacements(playerIDs); err != nil {
		return fmt.Errorf("failed to update placements: %w", err)
	}

	// Increment tournament matches
	if err := m.incrementMatches(); err != nil {
		return fmt.Errorf("failed to increment matches: %w", err)
	}

	log.Printf("Tournament completed successfully")
	return nil
}

// Run executes a match for the given contender
func (m *Match) Run(contenderID uint) error {
	// Find contender
	var contender Player
	if err := m.DB.Preload("LastProgram.Instructions").First(&contender, contenderID).Error; err != nil {
		return fmt.Errorf("failed to find contender: %w", err)
	}

	if contender.LastProgram == nil {
		return fmt.Errorf("contender %d has no program", contenderID)
	}

	// Get top ten players
	var topTen []Player
	if err := m.DB.Where("place IS NOT NULL").
		Order("place").
		Limit(20). // Get top 20 to increase competition
		Preload("LastProgram.Instructions").
		Find(&topTen).Error; err != nil {
		return fmt.Errorf("failed to get top ten: %w", err)
	}

	// Build list of all participants (contender + top ten)
	playerIDs := []uint{contenderID}
	for _, p := range topTen {
		if p.ID != contenderID {
			playerIDs = append(playerIDs, p.ID)
		}
	}

	// Load all players
	var players []Player
	if err := m.DB.Where("id IN ?", playerIDs).
		Preload("LastProgram.Instructions").
		Preload("LastProgram.Player").
		Find(&players).Error; err != nil {
		return fmt.Errorf("failed to load players: %w", err)
	}

	// Reset all players' points
	for i := range players {
		players[i].ResetPoints()
	}

	// Prepare list of battles to run
	type battlePair struct {
		p1, p2 int
	}
	battlesToRun := make([]battlePair, 0)
	for i := range players {
		for j := range players {
			if i != j {
				battlesToRun = append(battlesToRun, battlePair{i, j})
			}
		}
	}

	// Shuffle battles for random order
	rand.Shuffle(len(battlesToRun), func(i, j int) {
		battlesToRun[i], battlesToRun[j] = battlesToRun[j], battlesToRun[i]
	})

	// Run battles
	for mult := 0; mult < BattleMultiplier; mult++ {
		for _, pair := range battlesToRun {
			if err := m.runBattle(&players[pair.p1], &players[pair.p2]); err != nil {
				return fmt.Errorf("failed to run battle: %w", err)
			}
		}
	}

	// Save all players
	for i := range players {
		if err := m.DB.Select("wins", "losses", "ties", "score", "last_battle_id", "last_program_id").Save(&players[i]).Error; err != nil {
			return fmt.Errorf("failed to save player: %w", err)
		}
	}

	// Update placements
	if err := m.updatePlacements(playerIDs); err != nil {
		return fmt.Errorf("failed to update placements: %w", err)
	}

	// Increment tournament matches
	if err := m.incrementMatches(); err != nil {
		return fmt.Errorf("failed to increment matches: %w", err)
	}

	return nil
}

func (m *Match) runBattle(player1, player2 *Player) error {
	battle := &Battle{
		Program1ID: *player1.LastProgramID,
		Program2ID: *player2.LastProgramID,
	}

	// Run and save the battle using the battle runner service
	if err := m.BattleRunner.RunAndSaveBattle(battle); err != nil {
		return fmt.Errorf("failed to run and save battle: %w", err)
	}

	// Update player scores
	if battle.IsTie() {
		player1.Ties++
		player2.Ties++
	} else if battle.IsWinner1() {
		player1.Wins++
		player2.Losses++
	} else if battle.IsWinner2() {
		player2.Wins++
		player1.Losses++
	}

	// Update last battle references
	player1.LastBattleID = &battle.ID
	player2.LastBattleID = &battle.ID

	return nil
}

// runBattleConcurrent runs a battle with mutex protection for concurrent execution
func (m *Match) runBattleConcurrent(mu *sync.Mutex, player1, player2 *Player) error {
	battle := &Battle{
		Program1ID: *player1.LastProgramID,
		Program2ID: *player2.LastProgramID,
		// Pre-attach program data to avoid reloading from DB
		Program1: player1.LastProgram,
		Program2: player2.LastProgram,
	}

	// Run and save the battle using the battle runner service
	// This can happen without a lock since battles are independent
	if err := m.BattleRunner.RunAndSaveBattle(battle); err != nil {
		return fmt.Errorf("failed to run and save battle: %w", err)
	}

	// Lock to update player stats (critical section)
	mu.Lock()
	defer mu.Unlock()

	// Update player scores
	if battle.IsTie() {
		player1.Ties++
		player2.Ties++
	} else if battle.IsWinner1() {
		player1.Wins++
		player2.Losses++
	} else if battle.IsWinner2() {
		player2.Wins++
		player1.Losses++
	}

	// Update last battle references
	player1.LastBattleID = &battle.ID
	player2.LastBattleID = &battle.ID

	return nil
}

func (m *Match) updatePlacements(playerIDs []uint) error {
	var players []Player
	if err := m.DB.Where("id IN ?", playerIDs).
		Order("score DESC").
		Find(&players).Error; err != nil {
		return err
	}

	return m.DB.Transaction(func(tx *gorm.DB) error {
		for i, player := range players {
			place := i + 1
			var placePtr *int
			if place <= 20 {
				placePtr = &place
			}
			if err := tx.Model(&player).Update("place", placePtr).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (m *Match) incrementMatches() error {
	var info TournamentInfo
	if err := m.DB.First(&info).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			info = TournamentInfo{Matches: 1}
			return m.DB.Create(&info).Error
		}
		return err
	}

	info.Matches++
	return m.DB.Save(&info).Error
}
