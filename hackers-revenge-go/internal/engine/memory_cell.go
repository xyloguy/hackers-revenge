package engine

import (
	"fmt"
)

// MemoryCell represents a single cell in the shared memory
type MemoryCell struct {
	Opcode     string
	Argument   *int
	ProgramNum int // 1 or 2
}

// NewMemoryCell creates a new memory cell with validation
func NewMemoryCell(opcode string, argument *int, programNum int) (*MemoryCell, error) {
	if argument != nil {
		if *argument > 255 || *argument < -255 {
			return nil, fmt.Errorf("argument out of range: %d", *argument)
		}
	}

	return &MemoryCell{
		Opcode:     opcode,
		Argument:   argument,
		ProgramNum: programNum,
	}, nil
}

// NewMemoryCellNoOpcode creates a memory cell without an opcode (for SETARG, etc.)
func NewMemoryCellNoOpcode(argument int, programNum int) *MemoryCell {
	return &MemoryCell{
		Opcode:     "",
		Argument:   &argument,
		ProgramNum: programNum,
	}
}

// IsHCF returns true if this cell contains an HCF instruction
func (mc *MemoryCell) IsHCF() bool {
	return mc.Opcode == "HCF"
}

// IncArgument increments the argument by the given value
func (mc *MemoryCell) IncArgument(value int) {
	if mc.Argument == nil {
		mc.Argument = &value
	} else {
		newVal := *mc.Argument + value
		mc.Argument = &newVal
	}
}
