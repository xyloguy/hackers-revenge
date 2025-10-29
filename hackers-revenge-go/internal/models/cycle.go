package models

// Cycle status constants
const (
	StatusTie                   = -1
	StatusRunning               = 0
	StatusDiedExecutingNil      = 1
	StatusDiedExecutingEnemyHCF = 2
	StatusDiedExecutingOwnHCF   = 3
	StatusDiedStackOverflow     = 4
	StatusDiedStackUnderflow    = 5
	StatusDiedArgOverflow       = 6
	StatusDiedInvalidOpcode     = 7
	StatusDiedJump0             = 8
)

// Cycle represents a single execution cycle in a round
type Cycle struct {
	CycleNumber   int                      `json:"cycle"`
	ProgramNumber int                      `json:"program"`
	Status        int                      `json:"status"`
	Opcode        string                   `json:"opcode,omitempty"`
	Argument      *int                     `json:"arg,omitempty"`
	OldIP         int                      `json:"old_ip"`
	NewIP         int                      `json:"new_ip"`
	OldStack      string                   `json:"old_stack"`
	NewStack      string                   `json:"new_stack"`
	ReadAddrFirst *int                     `json:"read_addr_first,omitempty"`
	ReadAddrLast  *int                     `json:"read_addr_last,omitempty"`
	Writes        []map[string]interface{} `json:"writes,omitempty"`
}

// ToHashForJournal returns a hash suitable for journal output
func (c *Cycle) ToHashForJournal() map[string]interface{} {
	result := map[string]interface{}{
		"cycle":     c.CycleNumber,
		"program":   c.ProgramNumber,
		"status":    c.Status,
		"opcode":    c.Opcode,
		"arg":       c.Argument,
		"old_ip":    c.OldIP,
		"new_ip":    c.NewIP,
		"old_stack": c.OldStack,
		"new_stack": c.NewStack,
	}

	if c.ReadAddrFirst != nil {
		result["read_addr_first"] = *c.ReadAddrFirst
	}

	if c.ReadAddrLast != nil {
		result["read_addr_last"] = *c.ReadAddrLast
	}

	if len(c.Writes) > 0 {
		result["writes"] = c.Writes
	}

	return result
}
