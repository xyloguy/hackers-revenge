package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
)

type ContendersHandler struct {
	DB *gorm.DB
}

func NewContendersHandler(db *gorm.DB) *ContendersHandler {
	return &ContendersHandler{DB: db}
}

// Show handles GET /contenders
func (h *ContendersHandler) Show(c *gin.Context) {
	players, err := models.GetContenders(h.DB, 50)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get contenders"})
		return
	}

	contenders := make([]map[string]interface{}, len(players))
	for i, player := range players {
		contenders[i] = player.ToHashForContender()
	}

	c.JSON(http.StatusOK, gin.H{
		"contenders": contenders,
	})
}
