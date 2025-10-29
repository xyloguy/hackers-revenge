package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

type TokenHandler struct {
	DB *gorm.DB
}

func NewTokenHandler(db *gorm.DB) *TokenHandler {
	return &TokenHandler{DB: db}
}

// Show handles GET /token - creates or returns a player token
func (h *TokenHandler) Show(c *gin.Context) {
	player, err := models.NewRandomPlayer(h.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate player"})
		return
	}

	if err := h.DB.Create(player).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create player"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": player.Token,
		"name":  player.Name,
	})
}
