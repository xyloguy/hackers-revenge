package database

import (
	"testing"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

// TestAutoMigrate verifies that AutoMigrate can create all tables without errors
func TestAutoMigrate(t *testing.T) {
	// Use in-memory SQLite for testing
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to open test database: %v", err)
	}

	// Set the global DB for AutoMigrate to use
	DB = db

	// Run AutoMigrate
	err = AutoMigrate()
	if err != nil {
		t.Fatalf("AutoMigrate failed: %v", err)
	}

	// Verify each table exists by attempting to query it
	tables := []interface{}{
		&models.Player{},
		&models.Program{},
		&models.Instruction{},
		&models.Battle{},
		&models.Round{},
		&models.TournamentInfo{},
	}

	for _, table := range tables {
		if !db.Migrator().HasTable(table) {
			t.Errorf("Table for %T was not created", table)
		}
	}
}

// TestModelRelationships verifies that foreign key relationships are properly defined
func TestModelRelationships(t *testing.T) {
	// Use in-memory SQLite for testing
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to open test database: %v", err)
	}

	DB = db

	// Run AutoMigrate
	if err := AutoMigrate(); err != nil {
		t.Fatalf("AutoMigrate failed: %v", err)
	}

	// Create a player
	player := &models.Player{
		Token:  "test-token",
		Name:   "Test Player",
		Wins:   0,
		Losses: 0,
		Ties:   0,
		Score:  0,
	}
	if err := db.Create(player).Error; err != nil {
		t.Fatalf("Failed to create player: %v", err)
	}

	// Create a program for the player
	program := &models.Program{
		PlayerID: player.ID,
	}
	if err := db.Create(program).Error; err != nil {
		t.Fatalf("Failed to create program: %v", err)
	}

	// Create an instruction for the program
	instruction := &models.Instruction{
		ProgramID:  program.ID,
		LineNumber: 1,
		Opcode:     "PUSH",
		Argument:   intPtr(5),
	}
	if err := db.Create(instruction).Error; err != nil {
		t.Fatalf("Failed to create instruction: %v", err)
	}

	// Verify we can query with associations
	var loadedProgram models.Program
	if err := db.Preload("Instructions").First(&loadedProgram, program.ID).Error; err != nil {
		t.Fatalf("Failed to load program with instructions: %v", err)
	}

	if len(loadedProgram.Instructions) != 1 {
		t.Errorf("Expected 1 instruction, got %d", len(loadedProgram.Instructions))
	}

	// Verify we can query player with program
	var loadedPlayer models.Player
	if err := db.Preload("Programs").First(&loadedPlayer, player.ID).Error; err != nil {
		t.Fatalf("Failed to load player with programs: %v", err)
	}

	if len(loadedPlayer.Programs) != 1 {
		t.Errorf("Expected 1 program, got %d", len(loadedPlayer.Programs))
	}
}

// TestUniqueConstraints verifies that unique constraints are enforced
func TestUniqueConstraints(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to open test database: %v", err)
	}

	DB = db

	if err := AutoMigrate(); err != nil {
		t.Fatalf("AutoMigrate failed: %v", err)
	}

	// Create first player
	player1 := &models.Player{
		Token: "unique-token",
		Name:  "Unique Name",
	}
	if err := db.Create(player1).Error; err != nil {
		t.Fatalf("Failed to create first player: %v", err)
	}

	// Try to create player with duplicate token
	player2 := &models.Player{
		Token: "unique-token",
		Name:  "Different Name",
	}
	err = db.Create(player2).Error
	if err == nil {
		t.Error("Expected error when creating player with duplicate token, got nil")
	}

	// Try to create player with duplicate name
	player3 := &models.Player{
		Token: "different-token",
		Name:  "Unique Name",
	}
	err = db.Create(player3).Error
	if err == nil {
		t.Error("Expected error when creating player with duplicate name, got nil")
	}
}

// Helper function to create int pointer
func intPtr(i int) *int {
	return &i
}
