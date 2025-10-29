package engine

import (
	"fmt"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

// RunRound executes a round and populates its cycles
func RunRound(round *models.Round) error {
	if err := round.Validate(); err != nil {
		return err
	}

	round.Cycles = make([]*models.Cycle, 0)
	round.Winner = models.WinnerTie

	// Initialize shared memory
	memory := make([]*MemoryCell, 256)

	// Create running programs
	prog1, err := NewRunningProgram(1, memory, round.Program1StartIP, round.Battle.Program1.PreparedInstructions())
	if err != nil {
		return fmt.Errorf("failed to create program 1: %w", err)
	}

	prog2, err := NewRunningProgram(2, memory, round.Program2StartIP, round.Battle.Program2.PreparedInstructions())
	if err != nil {
		return fmt.Errorf("failed to create program 2: %w", err)
	}

	progs := []*RunningProgram{prog1, prog2}
	firstIndex := round.FirstPlayer - 1

	// Run cycles
	for cycleNum := 1; cycleNum <= models.MaxCycles; cycleNum++ {
		// First player's turn
		runCycle(round, cycleNum, progs[firstIndex])
		if round.Winner != models.WinnerTie {
			break
		}

		// Second player's turn
		runCycle(round, cycleNum, progs[1-firstIndex])
		if round.Winner != models.WinnerTie {
			break
		}
	}

	// If no winner after max cycles, it's a tie
	if round.Winner == models.WinnerTie && len(round.Cycles) > 0 {
		round.Cycles[len(round.Cycles)-1].Status = models.StatusTie
	}

	return nil
}

func runCycle(round *models.Round, cycleNum int, prog *RunningProgram) {
	status := prog.RunNextInstruction()

	cycle := &models.Cycle{
		CycleNumber:   cycleNum,
		ProgramNumber: prog.ProgramNum,
		Status:        status,
		Opcode:        prog.RanOpcode,
		Argument:      prog.RanArgument,
		OldIP:         prog.OldIP,
		NewIP:         prog.IP,
		OldStack:      StackToString(prog.OldStack),
		NewStack:      StackToString(prog.Stack),
		ReadAddrFirst: prog.ReadAddrFirst,
		ReadAddrLast:  prog.ReadAddrLast,
		Writes:        prog.Wrotes,
	}

	round.Cycles = append(round.Cycles, cycle)

	if status != models.StatusRunning {
		// Program died, other player wins
		round.Winner = models.WinnerType(3 - prog.ProgramNum)
	}
}

// RunBattle executes all rounds of a battle
func RunBattle(battle *models.Battle) error {
	battle.Rounds = make([]models.Round, 0, models.MaxRounds)
	firstPlayer := 1

	for roundNum := 1; roundNum <= models.MaxRounds; roundNum++ {
		round := models.Round{
			BattleID:    battle.ID,
			Battle:      battle,
			RoundNumber: roundNum,
			FirstPlayer: firstPlayer,
		}

		round.RandomizeStartIPs()

		if err := RunRound(&round); err != nil {
			return fmt.Errorf("failed to run round %d: %w", roundNum, err)
		}

		battle.Rounds = append(battle.Rounds, round)
		firstPlayer = 3 - firstPlayer // Alternate first player
	}

	battle.SetWinner()
	return nil
}
