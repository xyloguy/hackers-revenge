package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/worker"
)

type TournamentHandler struct {
	WorkerClient *worker.Client
}

func NewTournamentHandler(workerClient *worker.Client) *TournamentHandler {
	return &TournamentHandler{WorkerClient: workerClient}
}

// TriggerFullTournament handles POST /tournament/rerun
func (h *TournamentHandler) TriggerFullTournament(c *gin.Context) {
	// Enqueue the full tournament task
	if err := h.WorkerClient.EnqueueFullTournament(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to enqueue tournament"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Full tournament queued for execution",
		"status":  "queued",
	})
}
