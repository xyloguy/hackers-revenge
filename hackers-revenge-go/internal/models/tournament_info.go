package models

import (
	"time"
)

type TournamentInfo struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	EndAt     *time.Time `json:"end_at,omitempty"`
	Matches   int        `gorm:"default:0" json:"matches"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

// TableName specifies the table name for GORM
func (TournamentInfo) TableName() string {
	return "tournament_infos"
}

// Running returns true if the tournament is still running
func (ti *TournamentInfo) Running() bool {
	if ti.EndAt == nil {
		return true
	}
	return time.Now().Before(*ti.EndAt)
}

// RemainingSeconds returns the number of seconds remaining in the tournament
func (ti *TournamentInfo) RemainingSeconds() int {
	if ti.EndAt == nil {
		return -1 // No end time set
	}

	remaining := time.Until(*ti.EndAt).Seconds()
	if remaining < 0 {
		return 0
	}
	return int(remaining)
}
