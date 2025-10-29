package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/worker"
)

type ProgramHandler struct {
	DB              *gorm.DB
	MaxPrograms     int
	WorkerClient    *worker.Client
}

func NewProgramHandler(db *gorm.DB, maxPrograms int, workerClient *worker.Client) *ProgramHandler {
	return &ProgramHandler{
		DB:           db,
		MaxPrograms:  maxPrograms,
		WorkerClient: workerClient,
	}
}

type ProgramCreateRequest struct {
	Token string                       `json:"token" binding:"required"`
	Code  []models.CodeInstruction     `json:"code" binding:"required"`
}

type ProgramLoadRequest struct {
	Token string `json:"token" binding:"required"`
}

// Create handles POST /program
func (h *ProgramHandler) Create(c *gin.Context) {
	var req ProgramCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Normalize token
	token := models.NormalizeToken(req.Token)

	// Find player
	var player models.Player
	if err := h.DB.Where("token = ?", token).First(&player).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Check tournament is running
	tournamentInfo, err := models.GetOrCreateTournamentInfo(h.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check tournament status"})
		return
	}

	if !tournamentInfo.Running() {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Tournament has ended; no more programs may be submitted"})
		return
	}

	// Check submission limit
	var programCount int64
	if err := h.DB.Model(&models.Program{}).Where("player_id = ?", player.ID).Count(&programCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check program count"})
		return
	}

	if programCount >= int64(h.MaxPrograms) {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "No more programs may be submitted"})
		return
	}

	// Build and validate program
	program := models.BuildProgram(&player, req.Code)

	// Validate all instructions
	for i := range program.Instructions {
		if err := program.Instructions[i].Validate(); err != nil {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
			return
		}
	}

	// Save program
	if err := h.DB.Create(program).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save program"})
		return
	}

	// Update player's last_program_id
	player.LastProgramID = &program.ID
	if err := h.DB.Save(&player).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update player"})
		return
	}

	// Enqueue match worker
	if err := h.WorkerClient.EnqueueMatch(player.ID); err != nil {
		// Log error but don't fail the request
		c.JSON(http.StatusOK, gin.H{
			"programs_submitted": programCount + 1,
			"programs_remaining": h.MaxPrograms - int(programCount) - 1,
			"player_name":        player.Name,
			"warning":            "Program submitted but match scheduling failed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"programs_submitted": programCount + 1,
		"programs_remaining": h.MaxPrograms - int(programCount) - 1,
		"player_name":        player.Name,
	})
}

// LoadProgram handles POST /load_program
func (h *ProgramHandler) LoadProgram(c *gin.Context) {
	var req ProgramLoadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	token := models.NormalizeToken(req.Token)

	var player models.Player
	if err := h.DB.Where("token = ?", token).
		Preload("LastProgram.Instructions").
		First(&player).Error; err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Error loading previous submission"})
		return
	}

	if player.LastProgram == nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Error loading previous submission"})
		return
	}

	// Return instructions
	instructions := make([]map[string]interface{}, len(player.LastProgram.Instructions))
	for i, inst := range player.LastProgram.Instructions {
		instructions[i] = map[string]interface{}{
			"line_number": inst.LineNumber,
			"opcode":      inst.Opcode,
			"argument":    inst.Argument,
		}
	}

	c.JSON(http.StatusOK, instructions)
}
