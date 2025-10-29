package engine

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

const (
	MaxStackSize = 16
	MinArgValue  = -1000000
	MaxArgValue  = 1000000
	MemorySize   = 256
)

// RunningProgram represents a program being executed
type RunningProgram struct {
	ProgramNum int           // 1 or 2
	Memory     []*MemoryCell // shared memory (256 cells)
	Stack      []int         // program's stack
	IP         int           // instruction pointer (0-255)

	// State tracking for the last instruction
	OldStack      []int
	OldIP         int
	RanOpcode     string
	RanArgument   *int
	ReadAddrFirst *int
	ReadAddrLast  *int
	Wrotes        []map[string]interface{}
}

// NewRunningProgram creates a new running program
func NewRunningProgram(programNum int, memory []*MemoryCell, startIP int, instructions []models.Instruction) (*RunningProgram, error) {
	if len(instructions) == 0 {
		return nil, fmt.Errorf("no instructions provided")
	}
	if len(instructions) > models.MaxInstructions {
		return nil, fmt.Errorf("too many instructions")
	}

	rp := &RunningProgram{
		ProgramNum: programNum,
		Memory:     memory,
		Stack:      make([]int, 0, MaxStackSize),
		IP:         startIP % 256,
		OldStack:   make([]int, 0),
		OldIP:      startIP % 256,
	}

	// Load instructions into memory
	if err := rp.loadToMemory(instructions); err != nil {
		return nil, err
	}

	return rp, nil
}

// loadToMemory loads the program's instructions into shared memory
func (rp *RunningProgram) loadToMemory(instructions []models.Instruction) error {
	pos := rp.IP
	for _, inst := range instructions {
		cell, err := NewMemoryCell(inst.Opcode, inst.Argument, rp.ProgramNum)
		if err != nil {
			return err
		}
		rp.Memory[pos] = cell
		pos = (pos + 1) % 256
	}
	return nil
}

// RunNextInstruction executes the next instruction and returns the status
func (rp *RunningProgram) RunNextInstruction() int {
	// Save state
	rp.OldStack = make([]int, len(rp.Stack))
	copy(rp.OldStack, rp.Stack)
	rp.OldIP = rp.IP
	rp.RanOpcode = ""
	rp.RanArgument = nil
	rp.ReadAddrFirst = nil
	rp.ReadAddrLast = nil
	rp.Wrotes = nil

	// Get instruction at current IP
	inst := rp.Memory[rp.IP]
	if inst == nil || inst.Opcode == "" {
		return models.StatusDiedExecutingNil
	}

	rp.RanOpcode = inst.Opcode
	rp.RanArgument = inst.Argument

	// Check for argument overflow
	arg := rp.arg()
	if arg < MinArgValue || arg > MaxArgValue {
		return models.StatusDiedArgOverflow
	}

	// Execute the instruction
	switch rp.RanOpcode {
	case "NOOP":
		return rp.runNoop()
	case "PUSH":
		return rp.runPush()
	case "DROP":
		return rp.runDrop()
	case "DUPE":
		return rp.runDupe()
	case "DUPE2":
		return rp.runDupe2()
	case "SWAP":
		return rp.runSwap()
	case "INC":
		return rp.runInc()
	case "ADD":
		return rp.runAdd()
	case "SUBTRACT":
		return rp.runSubtract()
	case "DIVIDE":
		return rp.runDivide()
	case "MULTIPLY":
		return rp.runMultiply()
	case "GT":
		return rp.runGT()
	case "LT":
		return rp.runLT()
	case "NEGATE":
		return rp.runNegate()
	case "JUMP":
		return rp.runJump()
	case "JUMPZ":
		return rp.runJumpZ()
	case "JUMPG":
		return rp.runJumpG()
	case "HCF":
		return rp.runHCF(inst)
	case "SCAN":
		return rp.runScan()
	case "COPY":
		return rp.runCopy(false, 0)
	case "ICOPY":
		return rp.runCopy(true, 0)
	//case "COPY2":
	//	return rp.runCopy(false, 1)
	case "SETARG":
		return rp.runSetArg()
	case "PUSHARG":
		return rp.runPushArg()
	case "INCARG":
		return rp.runIncArg()
	case "DECSKIP":
		return rp.runDecSkip()
	default:
		return models.StatusDiedInvalidOpcode
	}
}

// Helper functions

func (rp *RunningProgram) arg() int {
	if rp.RanArgument == nil {
		return 0
	}
	return *rp.RanArgument
}

func (rp *RunningProgram) incIP() int {
	rp.IP = (rp.IP + 1) % 256
	return models.StatusRunning
}

// Stack operations

func (rp *RunningProgram) stackPush(val int) int {
	if len(rp.Stack) >= MaxStackSize {
		return models.StatusDiedStackOverflow
	}
	rp.Stack = append(rp.Stack, val)
	return models.StatusRunning
}

func (rp *RunningProgram) stackPop() (int, int) {
	if len(rp.Stack) == 0 {
		return 0, models.StatusDiedStackUnderflow
	}
	val := rp.Stack[len(rp.Stack)-1]
	rp.Stack = rp.Stack[:len(rp.Stack)-1]
	return val, models.StatusRunning
}

func (rp *RunningProgram) stackPeek() (int, int) {
	if len(rp.Stack) == 0 {
		return 0, models.StatusDiedStackUnderflow
	}
	return rp.Stack[len(rp.Stack)-1], models.StatusRunning
}

// Opcode implementations

func (rp *RunningProgram) runNoop() int {
	return rp.incIP()
}

func (rp *RunningProgram) runPush() int {
	if status := rp.stackPush(rp.arg()); status != models.StatusRunning {
		return status
	}
	return rp.incIP()
}

func (rp *RunningProgram) runDrop() int {
	if _, status := rp.stackPop(); status != models.StatusRunning {
		return status
	}
	return rp.incIP()
}

func (rp *RunningProgram) runDupe() int {
	val, status := rp.stackPeek()
	if status != models.StatusRunning {
		return status
	}
	if status := rp.stackPush(val); status != models.StatusRunning {
		return status
	}
	return rp.incIP()
}

func (rp *RunningProgram) runDupe2() int {
	val, status := rp.stackPeek()
	if status != models.StatusRunning {
		return status
	}
	if status := rp.stackPush(val); status != models.StatusRunning {
		return status
	}
	if status := rp.stackPush(val); status != models.StatusRunning {
		return status
	}
	return rp.incIP()
}

func (rp *RunningProgram) runSwap() int {
	if len(rp.Stack) < 2 {
		return models.StatusDiedStackUnderflow
	}
	last := len(rp.Stack) - 1
	rp.Stack[last], rp.Stack[last-1] = rp.Stack[last-1], rp.Stack[last]
	return rp.incIP()
}

func (rp *RunningProgram) runInc() int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}
	rp.Stack[len(rp.Stack)-1] += rp.arg()
	return rp.incIP()
}

func (rp *RunningProgram) runAdd() int {
	if len(rp.Stack) < 2 {
		return models.StatusDiedStackUnderflow
	}
	val1, _ := rp.stackPop()
	val2, _ := rp.stackPop()
	value := val1 + val2
	if value < MinArgValue || value > MaxArgValue {
		return models.StatusDiedArgOverflow
	}
	rp.Stack = append(rp.Stack, value%256)
	return rp.incIP()
}

func (rp *RunningProgram) runSubtract() int {
	if len(rp.Stack) < 2 {
		return models.StatusDiedStackUnderflow
	}
	arg1, _ := rp.stackPop()
	arg2, _ := rp.stackPop()
	value := arg2 - arg1
	if value < MinArgValue || value > MaxArgValue {
		return models.StatusDiedArgOverflow
	}
	rp.Stack = append(rp.Stack, value%256)
	return rp.incIP()
}

func (rp *RunningProgram) runDivide() int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}
	arg2 := rp.arg()
	if arg2 != 0 {
		arg1, _ := rp.stackPop()
		value := arg1 / arg2
		if value < MinArgValue || value > MaxArgValue {
			return models.StatusDiedArgOverflow
		}
		rp.Stack = append(rp.Stack, value%256)
	}
	return rp.incIP()
}

func (rp *RunningProgram) runMultiply() int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}
	arg2 := rp.arg()
	if arg2 != 0 {
		arg1, _ := rp.stackPop()
		value := arg1 * arg2
		if value < MinArgValue || value > MaxArgValue {
			return models.StatusDiedArgOverflow
		}
		rp.Stack = append(rp.Stack, value%256)
	}
	return rp.incIP()
}

func (rp *RunningProgram) runGT() int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}
	val, _ := rp.stackPop()
	if val > rp.arg() {
		rp.Stack = append(rp.Stack, 1)
	} else {
		rp.Stack = append(rp.Stack, 0)
	}
	return rp.incIP()
}

func (rp *RunningProgram) runLT() int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}
	val, _ := rp.stackPop()
	if val < rp.arg() {
		rp.Stack = append(rp.Stack, 1)
	} else {
		rp.Stack = append(rp.Stack, 0)
	}
	return rp.incIP()
}

func (rp *RunningProgram) runNegate() int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}
	rp.Stack[len(rp.Stack)-1] *= -1
	return rp.incIP()
}

func (rp *RunningProgram) runJump() int {
	if rp.arg() == 0 {
		return models.StatusDiedJump0
	}
	rp.IP = (rp.IP + rp.arg()) % 256
	if rp.IP < 0 {
		rp.IP += 256
	}
	return models.StatusRunning
}

func (rp *RunningProgram) runJumpZ() int {
	val, status := rp.stackPop()
	if status != models.StatusRunning {
		return status
	}
	if val == 0 {
		return rp.runJump()
	}
	return rp.incIP()
}

func (rp *RunningProgram) runJumpG() int {
	val, status := rp.stackPop()
	if status != models.StatusRunning {
		return status
	}
	if val > 0 {
		return rp.runJump()
	}
	return rp.incIP()
}

func (rp *RunningProgram) runHCF(inst *MemoryCell) int {
	if inst.ProgramNum == rp.ProgramNum {
		return models.StatusDiedExecutingOwnHCF
	}
	return models.StatusDiedExecutingEnemyHCF
}

func (rp *RunningProgram) runScan() int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}

	stackVal, _ := rp.stackPop()
	pos := (rp.IP + stackVal) % 256
	if pos < 0 {
		pos += 256
	}
	count := rp.arg()
	var instFound *MemoryCell

	if count != 0 {
		first := pos
		rp.ReadAddrFirst = &first
	}

	for count != 0 {
		instFound = rp.Memory[pos]
		if instFound != nil && instFound.Opcode != "" {
			break
		}

		if count > 0 {
			pos = (pos + 1) % 256
			count--
		} else {
			pos = (pos - 1 + 256) % 256
			count++
		}
	}

	if rp.ReadAddrFirst != nil {
		last := pos
		rp.ReadAddrLast = &last

		// Reverse first and last when scan was backwards
		if rp.arg() < 0 {
			rp.ReadAddrFirst, rp.ReadAddrLast = rp.ReadAddrLast, rp.ReadAddrFirst
		}
	}

	if instFound == nil || instFound.Opcode == "" {
		rp.Stack = append(rp.Stack, 0)
	} else if instFound.IsHCF() {
		rp.Stack = append(rp.Stack, -1)
	} else {
		rp.Stack = append(rp.Stack, 1)
	}

	return rp.incIP()
}

func (rp *RunningProgram) runCopy(indirect bool, copy2 int) int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}

	stackVal, _ := rp.stackPop()
	writes := make([]map[string]interface{}, 0)

	unlimitedFireSpread := false
	if envVal := os.Getenv("UNLIMITED_FIRE_SPREAD"); envVal != "" {
		if val, err := strconv.Atoi(envVal); err == nil && val == 1 {
			unlimitedFireSpread = true
		}
	}

	for i := 0; i <= copy2; i++ {
		srcPos := (rp.IP + i + rp.arg()) % 256
		if srcPos < 0 {
			srcPos += 256
		}

		dstPos := (rp.IP + i + stackVal) % 256
		if dstPos < 0 {
			dstPos += 256
		}

		if indirect && rp.Memory[dstPos] != nil && rp.Memory[dstPos].Argument != nil {
			dstPos = (dstPos + *rp.Memory[dstPos].Argument) % 256
			if dstPos < 0 {
				dstPos += 256
			}
		}

		explosion := false
		if rp.Memory[srcPos] != nil && rp.Memory[srcPos].IsHCF() &&
			rp.Memory[dstPos] != nil && rp.Memory[dstPos].IsHCF() {
			explosion = true
		}

		rp.Memory[dstPos] = rp.Memory[srcPos]

		first := srcPos
		rp.ReadAddrFirst = &first
		rp.ReadAddrLast = &first

		wrote := make(map[string]interface{})
		wrote["addr"] = dstPos
		if rp.Memory[dstPos] != nil {
			wrote["opcode"] = rp.Memory[dstPos].Opcode
			if rp.Memory[dstPos].Argument != nil {
				wrote["argument"] = *rp.Memory[dstPos].Argument
			}
		}
		writes = append(writes, wrote)

		if explosion {
			// Spread fire
			dstPosBefore := (dstPos - 1 + 256) % 256
			for unlimitedFireSpread && rp.Memory[dstPosBefore] != nil && rp.Memory[dstPosBefore].IsHCF() {
				dstPosBefore = (dstPosBefore - 1 + 256) % 256
			}

			dstPosAfter := (dstPos + 1) % 256
			for unlimitedFireSpread && rp.Memory[dstPosAfter] != nil && rp.Memory[dstPosAfter].IsHCF() {
				dstPosAfter = (dstPosAfter + 1) % 256
			}

			rp.Memory[dstPosBefore] = rp.Memory[dstPos]
			rp.Memory[dstPosAfter] = rp.Memory[dstPos]

			explosion1 := make(map[string]interface{})
			for k, v := range wrote {
				explosion1[k] = v
			}
			explosion1["addr"] = dstPosBefore
			writes = append(writes, explosion1)

			explosion2 := make(map[string]interface{})
			for k, v := range wrote {
				explosion2[k] = v
			}
			explosion2["addr"] = dstPosAfter
			writes = append(writes, explosion2)
		}
	}

	rp.Wrotes = writes
	return rp.incIP()
}

func (rp *RunningProgram) runDecSkip() int {
	pos := (rp.IP + rp.arg()) % 256
	if pos < 0 {
		pos += 256
	}

	if rp.Memory[pos] == nil {
		rp.Memory[pos] = NewMemoryCellNoOpcode(-1, rp.ProgramNum)
	} else {
		rp.Memory[pos].IncArgument(-1)
		rp.Memory[pos].ProgramNum = rp.ProgramNum
	}

	wrote := make(map[string]interface{})
	wrote["addr"] = pos
	if rp.Memory[pos].Argument != nil {
		wrote["argument"] = *rp.Memory[pos].Argument
	}
	rp.Wrotes = []map[string]interface{}{wrote}

	if rp.Memory[pos].Argument != nil && *rp.Memory[pos].Argument == 0 {
		rp.incIP()
	}
	return rp.incIP()
}

func (rp *RunningProgram) runSetArg() int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}
	value, _ := rp.stackPop()
	pos := (rp.IP + rp.arg()) % 256
	if pos < 0 {
		pos += 256
	}

	if rp.Memory[pos] == nil {
		rp.Memory[pos] = NewMemoryCellNoOpcode(value, rp.ProgramNum)
	} else {
		arg := value
		rp.Memory[pos].Argument = &arg
		rp.Memory[pos].ProgramNum = rp.ProgramNum
	}

	wrote := make(map[string]interface{})
	wrote["addr"] = pos
	wrote["argument"] = value
	rp.Wrotes = []map[string]interface{}{wrote}

	return rp.incIP()
}

func (rp *RunningProgram) runPushArg() int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}
	stackVal, _ := rp.stackPop()
	pos := (rp.IP + stackVal) % 256
	if pos < 0 {
		pos += 256
	}

	value := 0
	if rp.Memory[pos] != nil && rp.Memory[pos].Argument != nil {
		value = *rp.Memory[pos].Argument
	}
	rp.Stack = append(rp.Stack, value)
	return rp.incIP()
}

func (rp *RunningProgram) runIncArg() int {
	if len(rp.Stack) == 0 {
		return models.StatusDiedStackUnderflow
	}
	stackVal, _ := rp.stackPop()
	pos := (rp.IP + stackVal) % 256
	if pos < 0 {
		pos += 256
	}

	if rp.Memory[pos] == nil {
		rp.Memory[pos] = NewMemoryCellNoOpcode(rp.arg(), rp.ProgramNum)
	} else {
		rp.Memory[pos].IncArgument(rp.arg())
		rp.Memory[pos].ProgramNum = rp.ProgramNum
	}

	wrote := make(map[string]interface{})
	wrote["addr"] = pos
	if rp.Memory[pos].Argument != nil {
		wrote["argument"] = *rp.Memory[pos].Argument
	}
	rp.Wrotes = []map[string]interface{}{wrote}

	return rp.incIP()
}

// StackToString converts the stack to a comma-separated string
func StackToString(stack []int) string {
	if len(stack) == 0 {
		return ""
	}
	strStack := make([]string, len(stack))
	for i, v := range stack {
		strStack[i] = strconv.Itoa(v)
	}
	return strings.Join(strStack, ",")
}
