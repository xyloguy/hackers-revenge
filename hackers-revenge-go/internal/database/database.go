package database

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

// DB is the global database connection
var DB *gorm.DB

// Connect establishes a connection to the database
func Connect(databaseURL string) error {
	var err error
	DB, err = gorm.Open(mysql.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	return nil
}

// AutoMigrate runs auto migrations for all models
func AutoMigrate() error {
	// Disable foreign key checks during migration to allow tables to be created in any order
	DB.Exec("SET FOREIGN_KEY_CHECKS = 0")
	defer DB.Exec("SET FOREIGN_KEY_CHECKS = 1")

	// Migrate tables in dependency order
	// First, tables with no dependencies
	if err := DB.AutoMigrate(&models.Player{}); err != nil {
		return fmt.Errorf("failed to migrate Player: %w", err)
	}

	if err := DB.AutoMigrate(&models.TournamentInfo{}); err != nil {
		return fmt.Errorf("failed to migrate TournamentInfo: %w", err)
	}

	// Then tables that depend on players
	if err := DB.AutoMigrate(&models.Program{}); err != nil {
		return fmt.Errorf("failed to migrate Program: %w", err)
	}

	// Then tables that depend on programs
	if err := DB.AutoMigrate(&models.Instruction{}); err != nil {
		return fmt.Errorf("failed to migrate Instruction: %w", err)
	}

	if err := DB.AutoMigrate(&models.Battle{}); err != nil {
		return fmt.Errorf("failed to migrate Battle: %w", err)
	}

	// Finally, tables that depend on battles
	if err := DB.AutoMigrate(&models.Round{}); err != nil {
		return fmt.Errorf("failed to migrate Round: %w", err)
	}

	return nil
}

// Seed populates the database with initial guardian players
func Seed() error {
	// Check if guardians already exist
	var count int64
	DB.Model(&models.Player{}).Where("name LIKE 'HCF %'").Count(&count)
	if count > 0 {
		return nil // Already seeded
	}

	// Create TournamentInfo if it doesn't exist
	var tournamentInfo models.TournamentInfo
	if err := DB.FirstOrCreate(&tournamentInfo).Error; err != nil {
		return fmt.Errorf("failed to create tournament info: %w", err)
	}

	// Guardian 1: HCF Sc4r3dy C4t
	player2 := &models.Player{
		Name:   "HCF Sc4r3dy C4t",
		Token:  models.RandomToken(),
		Wins:   2,
		Losses: 4,
		Ties:   0,
	}
	place2 := 2
	player2.Place = &place2
	if err := DB.Create(player2).Error; err != nil {
		return fmt.Errorf("failed to create player 2: %w", err)
	}

	code2 := []models.CodeInstruction{
		{Opcode: "NOOP", Arg: nil},
		{Opcode: "JUMP", Arg: intPtr(-1)},
	}
	program2 := models.BuildProgram(player2, code2)
	if err := DB.Create(program2).Error; err != nil {
		return fmt.Errorf("failed to create program 2: %w", err)
	}
	if err := DB.Model(player2).Update("last_program_id", program2.ID).Error; err != nil {
		return fmt.Errorf("failed to update player 2 last_program_id: %w", err)
	}

	// Guardian 2: HCF Sl0w F1r3
	player3 := &models.Player{
		Name:   "HCF Sl0w F1r3",
		Token:  models.RandomToken(),
		Wins:   6,
		Losses: 0,
		Ties:   0,
	}
	place3 := 1
	player3.Place = &place3
	if err := DB.Create(player3).Error; err != nil {
		return fmt.Errorf("failed to create player 3: %w", err)
	}

	code3 := []models.CodeInstruction{
		{Opcode: "PUSH", Arg: intPtr(2)},
		{Opcode: "INC", Arg: intPtr(1)},
		{Opcode: "DUPE", Arg: nil},
		{Opcode: "COPY", Arg: intPtr(2)},
		{Opcode: "JUMP", Arg: intPtr(-3)},
		{Opcode: "HCF", Arg: nil},
	}
	program3 := models.BuildProgram(player3, code3)
	if err := DB.Create(program3).Error; err != nil {
		return fmt.Errorf("failed to create program 3: %w", err)
	}
	if err := DB.Model(player3).Update("last_program_id", program3.ID).Error; err != nil {
		return fmt.Errorf("failed to update player 3 last_program_id: %w", err)
	}

	// Guardian 3: HCF Sc4nn3r
	player4 := &models.Player{
		Name:   "HCF Sc4nn3r",
		Token:  models.RandomToken(),
		Wins:   4,
		Losses: 2,
		Ties:   0,
	}
	place4 := 2
	player4.Place = &place4
	if err := DB.Create(player4).Error; err != nil {
		return fmt.Errorf("failed to create player 4: %w", err)
	}

	code4 := []models.CodeInstruction{
		{Opcode: "PUSH", Arg: intPtr(10)},
		{Opcode: "DUPE", Arg: nil},
		{Opcode: "SCAN", Arg: intPtr(1)},
		{Opcode: "JUMPG", Arg: intPtr(3)},
		{Opcode: "INC", Arg: intPtr(1)},
		{Opcode: "JUMP", Arg: intPtr(-4)},
		{Opcode: "INC", Arg: intPtr(-6)},
		{Opcode: "DUPE", Arg: nil},
		{Opcode: "COPY", Arg: intPtr(3)},
		{Opcode: "INC", Arg: intPtr(7)},
		{Opcode: "JUMP", Arg: intPtr(-9)},
		{Opcode: "HCF", Arg: nil},
	}
	program4 := models.BuildProgram(player4, code4)
	if err := DB.Create(program4).Error; err != nil {
		return fmt.Errorf("failed to create program 4: %w", err)
	}
	if err := DB.Model(player4).Update("last_program_id", program4.ID).Error; err != nil {
		return fmt.Errorf("failed to update player 4 last_program_id: %w", err)
	}

	return nil
}

// intPtr returns a pointer to an int
func intPtr(i int) *int {
	return &i
}

// Close closes the database connection
func Close() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
