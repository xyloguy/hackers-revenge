package main

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

// Random name generation
var adjectives = []string{
	"Swift", "Noble", "Sharp", "Brave", "Wise", "Silent", "Fierce", "Quick",
	"Dark", "Bright", "Fast", "Slow", "Strong", "Clever", "Bold", "Calm",
	"Wild", "Gentle", "Mighty", "Cunning", "Agile", "Sturdy", "Smooth", "Rough",
}

var animals = []string{
	"Wolf", "Bear", "Tiger", "Lynx", "Eagle", "Hawk", "Fox", "Lion",
	"Panther", "Falcon", "Raven", "Owl", "Cobra", "Dragon", "Phoenix", "Viper",
	"Jaguar", "Leopard", "Cheetah", "Puma", "Shark", "Orca", "Barracuda", "Python",
}

func generateName() string {
	adj := adjectives[rand.Intn(len(adjectives))]
	animal := animals[rand.Intn(len(animals))]
	return fmt.Sprintf("%s %s", adj, animal)
}

func generateToken() string {
	const chars = "abcdefghijklmnopqrstuvwxyz"
	token := make([]byte, 8)
	for i := range token {
		token[i] = chars[rand.Intn(len(chars))]
	}
	return string(token)
}

func main() {
	rand.Seed(time.Now().UnixNano())

	// Get database connection from environment
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "root:password@tcp(localhost:3306)/app?charset=utf8mb4&parseTime=True&loc=Local"
	}

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Get existing players with programs
	var existingPlayers []models.Player
	if err := db.Where("last_program_id IS NOT NULL").
		Preload("LastProgram.Instructions").
		Find(&existingPlayers).Error; err != nil {
		log.Fatalf("Failed to load existing players: %v", err)
	}

	if len(existingPlayers) == 0 {
		log.Fatal("No existing players with programs found")
	}

	log.Printf("Found %d existing players with programs", len(existingPlayers))

	// Get current player count
	var currentCount int64
	db.Model(&models.Player{}).Count(&currentCount)
	log.Printf("Current total players: %d", currentCount)

	// Generate players up to 100
	targetCount := 100
	toGenerate := targetCount - int(currentCount)
	if toGenerate <= 0 {
		log.Printf("Already have %d players, no need to generate more", currentCount)
		return
	}

	log.Printf("Generating %d new players...", toGenerate)

	successCount := 0
	for i := 0; i < toGenerate; i++ {
		// Pick a random existing player to copy from
		sourcePlayer := existingPlayers[rand.Intn(len(existingPlayers))]

		// Generate unique name and token
		name := generateName()
		token := generateToken()

		// Check if token already exists, regenerate if needed
		var existing models.Player
		for {
			if err := db.Where("token = ?", token).First(&existing).Error; err == gorm.ErrRecordNotFound {
				break
			}
			token = generateToken()
		}

		// Create new player
		player := models.Player{
			Token: token,
			Name:  name,
		}

		if err := db.Create(&player).Error; err != nil {
			log.Printf("Failed to create player %s: %v", name, err)
			continue
		}

		// Create program by copying instructions from source
		program := models.Program{
			PlayerID: player.ID,
		}

		if err := db.Create(&program).Error; err != nil {
			log.Printf("Failed to create program for %s: %v", name, err)
			continue
		}

		// Copy instructions
		for _, srcInstr := range sourcePlayer.LastProgram.Instructions {
			instr := models.Instruction{
				ProgramID:  program.ID,
				LineNumber: srcInstr.LineNumber,
				Opcode:     srcInstr.Opcode,
				Argument:   srcInstr.Argument,
			}
			if err := db.Create(&instr).Error; err != nil {
				log.Printf("Failed to create instruction for %s: %v", name, err)
				break
			}
		}

		// Update player's last_program_id
		player.LastProgramID = &program.ID
		if err := db.Save(&player).Error; err != nil {
			log.Printf("Failed to update player %s: %v", name, err)
			continue
		}

		successCount++
		if (successCount)%10 == 0 {
			log.Printf("Created %d/%d players...", successCount, toGenerate)
		}
	}

	log.Printf("Successfully created %d new players", successCount)

	// Final count
	db.Model(&models.Player{}).Count(&currentCount)
	log.Printf("Total players now: %d", currentCount)
}
