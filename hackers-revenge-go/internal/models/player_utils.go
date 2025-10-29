package models

import (
	"fmt"
	"math/rand"
	"strings"
	"time"

	"gorm.io/gorm"
)

// RandomToken generates a random 8-character lowercase token
func RandomToken() string {
	const charset = "abcdefghijklmnopqrstuvwxyz"
	b := make([]byte, 8)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

// RandomName generates a random player name
func RandomName(db *gorm.DB) (string, error) {
	// Simple adjective and animal lists (you could use a library like go-faker instead)
	adjectives := []string{
		"Swift", "Brave", "Clever", "Mighty", "Silent", "Bold", "Fierce", "Noble",
		"Quick", "Wise", "Strong", "Agile", "Sharp", "Keen", "Bright", "Calm",
	}
	animals := []string{
		"Wolf", "Eagle", "Bear", "Tiger", "Fox", "Hawk", "Lion", "Panther",
		"Dragon", "Phoenix", "Falcon", "Cobra", "Raven", "Lynx", "Jaguar", "Viper",
	}

	for i := 0; i < DuplicateNameChecks; i++ {
		adj := adjectives[rand.Intn(len(adjectives))]
		animal := animals[rand.Intn(len(animals))]
		name := fmt.Sprintf("%s %s", adj, animal)

		var count int64
		if err := db.Model(&Player{}).Where("name = ?", name).Count(&count).Error; err != nil {
			return "", err
		}

		if count == 0 {
			return name, nil
		}
	}

	return "", fmt.Errorf("failed to generate unique name after %d attempts", DuplicateNameChecks)
}

// NewRandomPlayer creates a new player with random token and name
func NewRandomPlayer(db *gorm.DB) (*Player, error) {
	name, err := RandomName(db)
	if err != nil {
		return nil, err
	}

	player := &Player{
		Token: RandomToken(),
		Name:  name,
		Wins:  0,
		Losses: 0,
		Ties:  0,
		Score: 0,
	}

	return player, nil
}

// GetTopPlayers returns the top N players by place
func GetTopPlayers(db *gorm.DB, limit int) ([]Player, error) {
	var players []Player
	err := db.Where("place IS NOT NULL").
		Order("place").
		Limit(limit).
		Preload("LastBattle").
		Preload("LastBattle.Program1.Player").
		Preload("LastBattle.Program2.Player").
		Find(&players).Error
	return players, err
}

// GetContenders returns recent contenders
func GetContenders(db *gorm.DB, limit int) ([]Player, error) {
	var players []Player
	err := db.Joins("JOIN programs ON programs.id = players.last_program_id").
		Order("programs.created_at DESC").
		Limit(limit).
		Preload("LastProgram").
		Preload("LastBattle").
		Find(&players).Error
	return players, err
}

// GetOrCreateTournamentInfo gets or creates the singleton tournament info
func GetOrCreateTournamentInfo(db *gorm.DB) (*TournamentInfo, error) {
	var info TournamentInfo
	err := db.First(&info).Error
	if err == gorm.ErrRecordNotFound {
		info = TournamentInfo{
			Matches: 0,
		}
		if err := db.Create(&info).Error; err != nil {
			return nil, err
		}
		return &info, nil
	}
	return &info, err
}

func init() {
	rand.Seed(time.Now().UnixNano())
}

// NormalizeToken converts token to lowercase and trims whitespace
func NormalizeToken(token string) string {
	return strings.ToLower(strings.TrimSpace(token))
}
