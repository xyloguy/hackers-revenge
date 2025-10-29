package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/engine"
	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

type RoundHandler struct {
	DB *gorm.DB
}

func NewRoundHandler(db *gorm.DB) *RoundHandler {
	return &RoundHandler{DB: db}
}

// Show handles GET /journal/:battle_id/:round_num
func (h *RoundHandler) Show(c *gin.Context) {
	battleID, err := strconv.ParseUint(c.Param("battle_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid battle_id"})
		return
	}

	roundNum, err := strconv.Atoi(c.Param("round_num"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid round_num"})
		return
	}

	// Load battle with programs
	var battle models.Battle
	if err := h.DB.Preload("Program1.Player").
		Preload("Program1.Instructions").
		Preload("Program2.Player").
		Preload("Program2.Instructions").
		First(&battle, battleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Battle not found"})
		return
	}

	// Try to load round from database
	var round models.Round
	err = h.DB.Where("battle_id = ? AND round_number = ?", battleID, roundNum).
		First(&round).Error

	if err == gorm.ErrRecordNotFound {
		// Round doesn't exist in DB, generate it on-the-fly
		// First, run the entire battle to generate all rounds
		battleCopy := battle // Make a copy to avoid modifying the loaded battle
		if err := engine.RunBattle(&battleCopy); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to run battle"})
			return
		}

		// Find the requested round
		if roundNum < 1 || roundNum > len(battleCopy.Rounds) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Round number out of range"})
			return
		}

		// Get the round (round numbers are 1-indexed)
		round = battleCopy.Rounds[roundNum-1]
		round.Battle = &battle
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load round"})
		return
	} else {
		// Round exists in DB, attach battle and re-run to generate cycles
		round.Battle = &battle
		if err := engine.RunRound(&round); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to run round"})
			return
		}
	}

	// Return journal
	c.JSON(http.StatusOK, round.ToJournalHash(false))
}
