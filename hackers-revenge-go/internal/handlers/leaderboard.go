package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

type LeaderboardHandler struct {
	DB *gorm.DB
}

func NewLeaderboardHandler(db *gorm.DB) *LeaderboardHandler {
	return &LeaderboardHandler{DB: db}
}

// Show handles GET /leaderboard
func (h *LeaderboardHandler) Show(c *gin.Context) {
	players, err := models.GetTopPlayers(h.DB, 20)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get leaderboard"})
		return
	}

	leaders := make([]map[string]interface{}, len(players))
	for i, player := range players {
		leaders[i] = player.ToHashForLeader()
	}

	tournamentInfo, err := models.GetOrCreateTournamentInfo(h.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get tournament info"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"leaders":           leaders,
		"remaining_seconds": tournamentInfo.RemainingSeconds(),
	})
}
