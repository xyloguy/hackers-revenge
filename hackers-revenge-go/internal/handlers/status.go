package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

type StatusHandler struct {
	DB *gorm.DB
}

func NewStatusHandler(db *gorm.DB) *StatusHandler {
	return &StatusHandler{DB: db}
}

// Show handles GET /status
func (h *StatusHandler) Show(c *gin.Context) {
	tournamentInfo, err := models.GetOrCreateTournamentInfo(h.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get tournament info"})
		return
	}

	var playerCount int64
	if err := h.DB.Model(&models.Player{}).Count(&playerCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count players"})
		return
	}

	var programCount int64
	if err := h.DB.Model(&models.Program{}).Count(&programCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count programs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tournament_running": tournamentInfo.Running(),
		"remaining_seconds":  tournamentInfo.RemainingSeconds(),
		"matches":            tournamentInfo.Matches,
		"players":            playerCount,
		"programs":           programCount,
	})
}
