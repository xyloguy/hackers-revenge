package worker

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hibiken/asynq"
)

const (
	TypeRunMatch           = "match:run"
	TypeRunFullTournament  = "tournament:run_full"
)

// Client wraps the Asynq client for enqueueing tasks
type Client struct {
	client *asynq.Client
}

// NewClient creates a new worker client
func NewClient(redisURL string) *Client {
	client := asynq.NewClient(asynq.RedisClientOpt{Addr: redisURL})
	return &Client{client: client}
}

// Close closes the client connection
func (c *Client) Close() error {
	return c.client.Close()
}

// MatchPayload is the payload for the run match task
type MatchPayload struct {
	ContenderID uint `json:"contender_id"`
}

// EnqueueMatch enqueues a match task for the given contender
func (c *Client) EnqueueMatch(contenderID uint) error {
	payload, err := json.Marshal(MatchPayload{ContenderID: contenderID})
	if err != nil {
		return fmt.Errorf("failed to marshal payload: %w", err)
	}

	task := asynq.NewTask(TypeRunMatch, payload)
	_, err = c.client.Enqueue(task)
	if err != nil {
		return fmt.Errorf("failed to enqueue task: %w", err)
	}

	return nil
}

// EnqueueFullTournament enqueues a full tournament task
func (c *Client) EnqueueFullTournament() error {
	task := asynq.NewTask(TypeRunFullTournament, nil)
	// Set a 10-minute timeout for large tournaments (100+ players)
	_, err := c.client.Enqueue(task, asynq.Timeout(10*time.Minute))
	if err != nil {
		return fmt.Errorf("failed to enqueue full tournament task: %w", err)
	}

	return nil
}
