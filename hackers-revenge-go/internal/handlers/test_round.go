package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/engine"
	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

type TestRoundHandler struct {
	DB *gorm.DB
}

func NewTestRoundHandler(db *gorm.DB) *TestRoundHandler {
	return &TestRoundHandler{DB: db}
}

var GuardianNames = []string{
	"HCF R3ckl3ss",
	"HCF Sc4r3dy C4t",
	"HCF Sl0w F1r3",
	"HCF Sc4nn3r",
}

type TestRoundRequest struct {
	Program1 struct {
		PlayerName string                   `json:"player_name" binding:"required"`
		Code       []models.CodeInstruction `json:"code" binding:"required"`
	} `json:"program1" binding:"required"`
	Program2 struct {
		PlayerToken string `json:"player_token"`
		PlayerName  string `json:"player_name"`
	} `json:"program2" binding:"required"`
}

// Create handles POST /test_round
func (h *TestRoundHandler) Create(c *gin.Context) {
	var req TestRoundRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Find player 2
	var player2 models.Player
	if req.Program2.PlayerToken != "" {
		token := models.NormalizeToken(req.Program2.PlayerToken)
		if err := h.DB.Where("token = ?", token).
			Preload("LastProgram.Instructions").
			First(&player2).Error; err != nil {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Player 2 not found; invalid token"})
			return
		}
	} else if req.Program2.PlayerName != "" {
		// Check if it's a guardian
		isGuardian := false
		for _, guardian := range GuardianNames {
			if req.Program2.PlayerName == guardian {
				isGuardian = true
				break
			}
		}

		if !isGuardian {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Player 2 not found; invalid guardian name"})
			return
		}

		if err := h.DB.Where("name = ?", req.Program2.PlayerName).
			Preload("LastProgram.Instructions").
			First(&player2).Error; err != nil {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Player 2 guardian not found; has the db been seeded?"})
			return
		}
	} else {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Player 2 not found; must provide token or name"})
		return
	}

	if player2.LastProgram == nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Player 2 has no last program"})
		return
	}

	// Create test players and programs
	player1 := &models.Player{
		Name:  req.Program1.PlayerName,
		Token: "unused",
	}

	program1 := models.BuildProgram(player1, req.Program1.Code)
	program2 := player2.LastProgram

	// Validate program1 instructions
	for i := range program1.Instructions {
		if err := program1.Instructions[i].Validate(); err != nil {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
			return
		}
	}

	// Create battle
	battle := &models.Battle{
		Program1: program1,
		Program2: program2,
	}

	// Create round
	round := &models.Round{
		Battle:      battle,
		RoundNumber: 1,
		FirstPlayer: 1,
	}
	round.RandomizeStartIPs()

	// Run the round
	if err := engine.RunRound(round); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// Determine if we should filter P2 (guardian)
	filterP2 := false
	for _, guardian := range GuardianNames {
		if player2.Name == guardian {
			filterP2 = true
			break
		}
	}

	// Return journal
	c.JSON(http.StatusOK, round.ToJournalHash(filterP2))
}
