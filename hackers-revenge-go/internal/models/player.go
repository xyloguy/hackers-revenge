package models

import (
	"time"

	"gorm.io/gorm"
)

type Player struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Token         string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"token"`
	Name          string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"name"`
	Wins          int       `gorm:"not null;default:0" json:"wins"`
	Losses        int       `gorm:"not null;default:0" json:"losses"`
	Ties          int       `gorm:"not null;default:0" json:"ties"`
	Score         int       `gorm:"index;not null;default:0" json:"score"`
	LastBattleID  *uint     `gorm:"index" json:"last_battle_id,omitempty"`
	LastProgramID *uint     `gorm:"index" json:"last_program_id,omitempty"`
	Place         *int      `gorm:"index" json:"place,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`

	// Associations
	LastBattle  *Battle   `gorm:"foreignKey:LastBattleID" json:"last_battle,omitempty"`
	LastProgram *Program  `gorm:"foreignKey:LastProgramID" json:"last_program,omitempty"`
	Programs    []Program `gorm:"foreignKey:PlayerID" json:"programs,omitempty"`
}

const (
	BattlesAgainstTopTen = 5
	BattlesAgainstAny    = 5
	DuplicateNameChecks  = 10
)

// TableName specifies the table name for GORM
func (Player) TableName() string {
	return "players"
}

// BeforeSave hook to adjust score before saving
func (p *Player) BeforeSave(tx *gorm.DB) error {
	p.Score = (p.Wins * 2) + p.Ties
	return nil
}

// ResetPoints resets the player's wins, losses, ties, and score
func (p *Player) ResetPoints() {
	p.Wins = 0
	p.Losses = 0
	p.Ties = 0
	p.Score = 0
}

// LastProgramNum returns whether this player was program 1 or 2 in their last battle
func (p *Player) LastProgramNum() *int {
	if p.LastBattle == nil || p.LastProgramID == nil {
		return nil
	}
	if p.LastBattle.Program1ID == *p.LastProgramID {
		num := 1
		return &num
	} else if p.LastBattle.Program2ID == *p.LastProgramID {
		num := 2
		return &num
	}
	return nil
}

// LastWinner returns 1 if player won, -1 if opponent won, 0 for tie, nil if no battle
func (p *Player) LastWinner() *int {
	if p.LastBattle == nil {
		return nil
	}
	result := 0
	if p.LastBattle.Winner == WinnerTie {
		return &result
	}

	progNum := p.LastProgramNum()
	if progNum == nil {
		return nil
	}

	if *progNum == int(p.LastBattle.Winner) {
		result = 1
	} else {
		result = -1
	}
	return &result
}

// ToHashForContender returns a hash suitable for the contenders endpoint
func (p *Player) ToHashForContender() map[string]interface{} {
	result := map[string]interface{}{
		"name":  p.Name,
		"score": p.Score,
	}

	if p.LastProgram != nil {
		result["last_program_timestamp"] = p.LastProgram.CreatedAt
	}

	if p.LastBattle != nil {
		result["last_battle_timestamp"] = p.LastBattle.CreatedAt
	}

	return result
}

// ToHashForLeader returns a hash suitable for the leaderboard endpoint
func (p *Player) ToHashForLeader() map[string]interface{} {
	result := map[string]interface{}{
		"name":   p.Name,
		"score":  p.Score,
		"wins":   p.Wins,
		"ties":   p.Ties,
		"losses": p.Losses,
	}

	if p.LastBattleID != nil {
		result["last_battle_id"] = *p.LastBattleID
	}

	if p.LastBattle != nil {
		result["last_battle_timestamp"] = p.LastBattle.CreatedAt
	}

	winner := p.LastWinner()
	if winner != nil {
		result["winner"] = *winner
	}

	// Get opponent name
	if p.LastBattle != nil {
		progNum := p.LastProgramNum()
		if progNum != nil {
			if *progNum == 1 && p.LastBattle.Program2 != nil && p.LastBattle.Program2.Player != nil {
				result["opponent_name"] = p.LastBattle.Program2.Player.Name
			} else if *progNum == 2 && p.LastBattle.Program1 != nil && p.LastBattle.Program1.Player != nil {
				result["opponent_name"] = p.LastBattle.Program1.Player.Name
			}
		}
	}

	return result
}
