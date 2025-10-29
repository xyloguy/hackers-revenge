package worker

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/hibiken/asynq"
	"gorm.io/gorm"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/models"
	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/services"
)

// Server wraps the Asynq server for processing tasks
type Server struct {
	server *asynq.Server
	mux    *asynq.ServeMux
	db     *gorm.DB
}

// NewServer creates a new worker server
func NewServer(redisURL string, db *gorm.DB) *Server {
	srv := asynq.NewServer(
		asynq.RedisClientOpt{Addr: redisURL},
		asynq.Config{
			Concurrency: 10,
			Queues: map[string]int{
				"default": 10,
			},
		},
	)

	mux := asynq.NewServeMux()

	s := &Server{
		server: srv,
		mux:    mux,
		db:     db,
	}

	// Register handlers
	mux.HandleFunc(TypeRunMatch, s.HandleRunMatch)
	mux.HandleFunc(TypeRunFullTournament, s.HandleRunFullTournament)

	return s
}

// Start starts the worker server
func (s *Server) Start() error {
	return s.server.Start(s.mux)
}

// Stop stops the worker server
func (s *Server) Stop() {
	s.server.Stop()
}

// Shutdown gracefully shuts down the worker server
func (s *Server) Shutdown() {
	s.server.Shutdown()
}

// HandleRunMatch handles the run match task
func (s *Server) HandleRunMatch(ctx context.Context, task *asynq.Task) error {
	var payload MatchPayload
	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		return fmt.Errorf("failed to unmarshal payload: %w", err)
	}

	log.Printf("Running match for contender %d", payload.ContenderID)

	battleService := services.NewBattleService(s.db)
	match := models.NewMatch(s.db, battleService)
	if err := match.Run(payload.ContenderID); err != nil {
		return fmt.Errorf("failed to run match: %w", err)
	}

	log.Printf("Match completed for contender %d", payload.ContenderID)
	return nil
}

// HandleRunFullTournament handles the full tournament task
func (s *Server) HandleRunFullTournament(ctx context.Context, task *asynq.Task) error {
	log.Printf("Starting full tournament run...")

	battleService := services.NewBattleService(s.db)
	match := models.NewMatch(s.db, battleService)
	if err := match.RunFullTournament(); err != nil {
		return fmt.Errorf("failed to run full tournament: %w", err)
	}

	log.Printf("Full tournament completed")
	return nil
}
