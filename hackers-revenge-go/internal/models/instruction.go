package models

import (
	"fmt"
	"time"
)

type Instruction struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	ProgramID  uint      `gorm:"index:idx_program_line,priority:1;not null" json:"program_id"`
	LineNumber int       `gorm:"index:idx_program_line,unique,priority:2;not null" json:"line_number"`
	Opcode     string    `gorm:"not null" json:"opcode"`
	Argument   *int      `json:"argument,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	// Associations
	Program *Program `gorm:"foreignKey:ProgramID" json:"program,omitempty"`
}

// TableName specifies the table name for GORM
func (Instruction) TableName() string {
	return "instructions"
}

var OpcodeTakesArg = map[string]bool{
	"NOOP":     false,
	"PUSH":     true,
	"DROP":     false,
	"DUPE":     false,
	"DUPE2":    false,
	"SWAP":     false,
	"INC":      true,
	"ADD":      false,
	"SUBTRACT": false,
	"DIVIDE":   true,
	"MULTIPLY": true,
	"GT":       true,
	"LT":       true,
	"NEGATE":   false,
	"JUMP":     true,
	"JUMPZ":    true,
	"JUMPG":    true,
	"HCF":      false,
	"SCAN":     true,
	"COPY":     true,
	//"COPY2":    true,
	"ICOPY":   true,
	"SETARG":  true,
	"PUSHARG": false,
	"INCARG":  true,
	"DECSKIP": true,
}

// Opcodes returns all valid opcodes
func Opcodes() []string {
	opcodes := make([]string, 0, len(OpcodeTakesArg))
	for opcode := range OpcodeTakesArg {
		opcodes = append(opcodes, opcode)
	}
	return opcodes
}

// Validate validates the instruction
func (i *Instruction) Validate() error {
	if i.LineNumber <= 0 {
		return fmt.Errorf("line_number must be present")
	}

	takesArg, validOpcode := OpcodeTakesArg[i.Opcode]
	if !validOpcode {
		return fmt.Errorf("opcode %s is not valid", i.Opcode)
	}

	if i.Argument != nil {
		if *i.Argument < -255 || *i.Argument > 255 {
			return fmt.Errorf("argument must be between -255 and 255")
		}
	}

	if takesArg && i.Argument == nil {
		return fmt.Errorf("argument must be provided with opcode %s", i.Opcode)
	}

	if !takesArg && i.Argument != nil {
		return fmt.Errorf("argument must not be provided with opcode %s", i.Opcode)
	}

	return nil
}
