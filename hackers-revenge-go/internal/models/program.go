package models

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"gorm.io/gorm"
)

const MaxInstructions = 25

type Program struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	PlayerID  uint      `gorm:"index;not null" json:"player_id"`
	CreatedAt time.Time `gorm:"index" json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Associations
	Player       *Player       `gorm:"foreignKey:PlayerID" json:"player,omitempty"`
	Instructions []Instruction `gorm:"foreignKey:ProgramID;constraint:OnDelete:CASCADE" json:"instructions,omitempty"`
}

// TableName specifies the table name for GORM
func (Program) TableName() string {
	return "programs"
}

// AfterSave hook to update the player's last_program_id
func (p *Program) AfterSave(tx *gorm.DB) error {
	// This would be handled by the service layer in Go
	return nil
}

// PreparedInstructions returns the instructions in order, or a default HCF if empty
func (p *Program) PreparedInstructions() []Instruction {
	if len(p.Instructions) == 0 {
		return []Instruction{
			{Opcode: "HCF"},
		}
	}

	// Instructions should already be sorted by LineNumber when loaded with order clause
	return p.Instructions
}

// ToCodeArrayForBuild converts the program to a code array suitable for building
func (p *Program) ToCodeArrayForBuild() []CodeInstruction {
	instructions := p.PreparedInstructions()
	result := make([]CodeInstruction, len(instructions))

	for i, inst := range instructions {
		result[i] = CodeInstruction{
			Opcode: inst.Opcode,
			Arg:    inst.Argument,
		}
	}

	return result
}

// ToHashForJournal returns a hash suitable for journal output
func (p *Program) ToHashForJournal(startIP int) map[string]interface{} {
	instructions := p.PreparedInstructions()
	code := make([]map[string]interface{}, len(instructions))

	for i, inst := range instructions {
		addr := (startIP + i) % 256
		code[i] = map[string]interface{}{
			"addr":   addr,
			"opcode": inst.Opcode,
			"arg":    inst.Argument,
		}
	}

	playerName := ""
	if p.Player != nil {
		playerName = p.Player.Name
	}

	return map[string]interface{}{
		"player_name": playerName,
		"start_ip":    startIP,
		"code":        code,
	}
}

// CodeInstruction represents a single instruction for building programs
type CodeInstruction struct {
	Opcode string `json:"opcode"`
	Arg    *int   `json:"arg,omitempty"`
}

// UnmarshalJSON custom unmarshaler to handle both string and int arguments
func (c *CodeInstruction) UnmarshalJSON(data []byte) error {
	// Use a temporary struct to parse the JSON
	type Alias struct {
		Opcode string      `json:"opcode"`
		Arg    interface{} `json:"arg"`
	}

	var aux Alias
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	c.Opcode = aux.Opcode

	// Handle arg which can be null, string, or int
	if aux.Arg != nil {
		var argValue int
		switch v := aux.Arg.(type) {
		case float64: // JSON numbers are parsed as float64
			argValue = int(v)
		case string:
			// Parse string to int
			parsed, err := strconv.Atoi(v)
			if err != nil {
				return fmt.Errorf("invalid argument: %s", v)
			}
			argValue = parsed
		default:
			return fmt.Errorf("argument must be a number or string, got %T", v)
		}
		c.Arg = &argValue
	}

	return nil
}

// BuildProgram creates a new program from code instructions
func BuildProgram(player *Player, code []CodeInstruction) *Program {
	program := &Program{
		PlayerID: player.ID,
		Player:   player,
	}

	instructions := make([]Instruction, 0, len(code))
	for i, c := range code {
		if i >= MaxInstructions {
			break
		}
		instructions = append(instructions, Instruction{
			LineNumber: i + 1,
			Opcode:     c.Opcode,
			Argument:   c.Arg,
		})
	}

	program.Instructions = instructions
	return program
}
