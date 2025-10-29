package models

import (
	"fmt"
	"math/rand"
	"time"
)

const (
	MaxCycles            = 1000
	RoundDeterministic   = false
)

type Round struct {
	ID              uint       `gorm:"primaryKey" json:"id"`
	BattleID        uint       `gorm:"index:idx_battle_round,priority:1;not null" json:"battle_id"`
	RoundNumber     int        `gorm:"index:idx_battle_round,unique,priority:2;not null" json:"round_number"`
	Winner          WinnerType `gorm:"default:0" json:"winner"`
	Program1StartIP int        `gorm:"not null" json:"program1_start_ip"`
	Program2StartIP int        `gorm:"not null" json:"program2_start_ip"`
	FirstPlayer     int        `gorm:"not null" json:"first_player"` // 1 or 2
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`

	// Associations
	Battle *Battle `gorm:"foreignKey:BattleID" json:"battle,omitempty"`

	// Cycles are not stored in DB, only generated during execution
	Cycles []*Cycle `gorm:"-" json:"cycles,omitempty"`
}

// TableName specifies the table name for GORM
func (Round) TableName() string {
	return "rounds"
}

// IsTie returns true if the round was a tie
func (r *Round) IsTie() bool {
	return r.Winner == WinnerTie
}

// IsWinner1 returns true if program1 won
func (r *Round) IsWinner1() bool {
	return r.Winner == Winner1
}

// IsWinner2 returns true if program2 won
func (r *Round) IsWinner2() bool {
	return r.Winner == Winner2
}

// Validate validates the round
func (r *Round) Validate() error {
	if r.RoundNumber <= 0 {
		return fmt.Errorf("round_number must be present")
	}
	if r.FirstPlayer != 1 && r.FirstPlayer != 2 {
		return fmt.Errorf("first_player must be 1 or 2")
	}
	return nil
}

// RandomizeStartIPs sets random starting instruction pointers for both programs
func (r *Round) RandomizeStartIPs() {
	if RoundDeterministic && r.Battle != nil && r.Battle.Program1 != nil && r.Battle.Program2 != nil {
		// Seed RNG deterministically based on player tokens and round number
		p1Token := r.Battle.Program1.Player.Token
		p2Token := r.Battle.Program2.Player.Token
		seed := hashString(p1Token) + hashString(p2Token) + int64(r.RoundNumber)
		rand.Seed(seed)
	}

	p1Count := len(r.Battle.Program1.Instructions)
	p2Count := len(r.Battle.Program2.Instructions)

	r.Program1StartIP = rand.Intn(256)
	r.Program2StartIP = (r.Program1StartIP + p1Count + rand.Intn(257-p1Count-p2Count)) % 256
}

// ToJournalHash returns a hash suitable for journal output
func (r *Round) ToJournalHash(filterP2 bool) map[string]interface{} {
	program1Hash := r.Battle.Program1.ToHashForJournal(r.Program1StartIP)
	program2Hash := r.Battle.Program2.ToHashForJournal(r.Program2StartIP)

	journalEntries := make([]map[string]interface{}, len(r.Cycles))
	for i, cycle := range r.Cycles {
		journalEntries[i] = cycle.ToHashForJournal()
	}

	if filterP2 {
		// Hide program 2's opcodes
		if code, ok := program2Hash["code"].([]map[string]interface{}); ok {
			for i := range code {
				code[i]["opcode"] = ""
				code[i]["arg"] = nil
			}
		}

		// Hide program 2's execution details
		for _, entry := range journalEntries {
			if program, ok := entry["program"].(int); ok && program == 2 {
				entry["opcode"] = ""
				entry["arg"] = nil
			}
		}
	}

	return map[string]interface{}{
		"program1": program1Hash,
		"program2": program2Hash,
		"journal":  journalEntries,
		"winner":   int(r.Winner),
	}
}

// Simple hash function for strings
func hashString(s string) int64 {
	var hash int64
	for _, c := range s {
		hash = 31*hash + int64(c)
	}
	return hash
}
