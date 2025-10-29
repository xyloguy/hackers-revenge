package services

import (
	"fmt"

	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/engine"
	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

// BattleService handles battle execution and persistence
type BattleService struct {
	DB *gorm.DB
}

// NewBattleService creates a new battle service
func NewBattleService(db *gorm.DB) *BattleService {
	return &BattleService{DB: db}
}

// RunBattleInMemory executes a battle purely in memory without any database operations
// Used for concurrent tournament processing where battles are computed first, then saved in batch
func (s *BattleService) RunBattleInMemory(battle *models.Battle) error {
	// Programs and players should already be loaded by the caller
	if battle.Program1 == nil || battle.Program2 == nil {
		return fmt.Errorf("programs must be pre-loaded before running battle in memory")
	}

	// Run the battle using the engine (generates rounds in memory)
	if err := engine.RunBattle(battle); err != nil {
		return fmt.Errorf("failed to run battle: %w", err)
	}

	return nil
}

// SaveBattlesBatch saves multiple battles to the database in a single transaction
func (s *BattleService) SaveBattlesBatch(battles []*models.Battle) error {
	if len(battles) == 0 {
		return nil
	}

	return s.DB.Transaction(func(tx *gorm.DB) error {
		// Create all battles in batch
		if err := tx.CreateInBatches(battles, 100).Error; err != nil {
			return fmt.Errorf("failed to create battles: %w", err)
		}
		return nil
	})
}

// RunAndSaveBattle executes a battle and saves it with all rounds
func (s *BattleService) RunAndSaveBattle(battle *models.Battle) error {
	// Create battle record first to get ID
	if err := s.DB.Create(battle).Error; err != nil {
		return fmt.Errorf("failed to create battle: %w", err)
	}

	// Check if programs are already loaded (optimization for concurrent tournaments)
	if battle.Program1 == nil || len(battle.Program1.Instructions) == 0 {
		// Load program1 with instructions
		if err := s.DB.Preload("Instructions").First(&battle.Program1, battle.Program1ID).Error; err != nil {
			return fmt.Errorf("failed to load program1: %w", err)
		}
	}

	if battle.Program2 == nil || len(battle.Program2.Instructions) == 0 {
		// Load program2 with instructions
		if err := s.DB.Preload("Instructions").First(&battle.Program2, battle.Program2ID).Error; err != nil {
			return fmt.Errorf("failed to load program2: %w", err)
		}
	}

	// Load players if not already loaded
	if battle.Program1.Player == nil {
		battle.Program1.Player = &models.Player{}
		if err := s.DB.First(battle.Program1.Player, battle.Program1.PlayerID).Error; err != nil {
			return fmt.Errorf("failed to load player1: %w", err)
		}
	}

	if battle.Program2.Player == nil {
		battle.Program2.Player = &models.Player{}
		if err := s.DB.First(battle.Program2.Player, battle.Program2.PlayerID).Error; err != nil {
			return fmt.Errorf("failed to load player2: %w", err)
		}
	}

	// Run the battle using the engine (generates rounds)
	if err := engine.RunBattle(battle); err != nil {
		return fmt.Errorf("failed to run battle: %w", err)
	}

	// Note: Rounds are NOT saved to database. They are generated on-the-fly
	// by the round handler when requested via /journal/:battle_id/:round_num

	// Update battle winner
	if err := s.DB.Model(battle).Update("winner", battle.Winner).Error; err != nil {
		return fmt.Errorf("failed to update battle winner: %w", err)
	}

	return nil
}
