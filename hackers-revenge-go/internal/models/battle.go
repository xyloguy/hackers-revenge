package models

import (
	"time"
)

const MaxRounds = 4

type WinnerType int

const (
	WinnerTie WinnerType = 0
	Winner1   WinnerType = 1
	Winner2   WinnerType = 2
)

type Battle struct {
	ID         uint       `gorm:"primaryKey" json:"id"`
	Program1ID uint       `gorm:"index;not null" json:"program1_id"`
	Program2ID uint       `gorm:"index;not null" json:"program2_id"`
	Winner     WinnerType `gorm:"default:0" json:"winner"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`

	// Associations
	Program1 *Program `gorm:"foreignKey:Program1ID" json:"program1,omitempty"`
	Program2 *Program `gorm:"foreignKey:Program2ID" json:"program2,omitempty"`
	Rounds   []Round  `gorm:"foreignKey:BattleID;constraint:OnDelete:CASCADE" json:"rounds,omitempty"`
}

// TableName specifies the table name for GORM
func (Battle) TableName() string {
	return "battles"
}

// IsTie returns true if the battle was a tie
func (b *Battle) IsTie() bool {
	return b.Winner == WinnerTie
}

// IsWinner1 returns true if program1 won
func (b *Battle) IsWinner1() bool {
	return b.Winner == Winner1
}

// IsWinner2 returns true if program2 won
func (b *Battle) IsWinner2() bool {
	return b.Winner == Winner2
}

// SetWinner determines and sets the winner based on round results
func (b *Battle) SetWinner() {
	winner1s := 0
	winner2s := 0

	for _, round := range b.Rounds {
		if round.IsWinner1() {
			winner1s++
		} else if round.IsWinner2() {
			winner2s++
		}
	}

	if winner1s > winner2s {
		b.Winner = Winner1
	} else if winner2s > winner1s {
		b.Winner = Winner2
	} else {
		b.Winner = WinnerTie
	}
}
