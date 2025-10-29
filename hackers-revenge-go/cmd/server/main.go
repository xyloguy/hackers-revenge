package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"

	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/config"
	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/database"
	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/handlers"
	"github.com/xyloguy/hackers-revenge/hackers-revenge-go/internal/worker"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Connect to database
	if err := database.Connect(cfg.DatabaseURL); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	log.Println("Connected to database")

	// Run auto migrations
	log.Println("Running database migrations...")
	if err := database.AutoMigrate(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	log.Println("Database migrations completed")

	// Seed database with guardian players
	log.Println("Seeding database with guardians...")
	if err := database.Seed(); err != nil {
		log.Fatalf("Failed to seed database: %v", err)
	}
	log.Println("Database seeding completed")

	// Create worker client for enqueueing jobs
	workerClient := worker.NewClient(cfg.RedisURL)
	defer workerClient.Close()

	// Setup Gin router
	router := gin.Default()

	// Setup middleware
	router.Use(gin.Recovery())
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Content-Type", "application/json")
		c.Next()
	})

	// Setup routes
	setupRoutes(router, cfg, workerClient)

	// Start worker server in a goroutine
	workerServer := worker.NewServer(cfg.RedisURL, database.DB)
	go func() {
		log.Println("Starting worker server...")
		if err := workerServer.Start(); err != nil {
			log.Fatalf("Worker server error: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Start HTTP server in a goroutine
	go func() {
		addr := ":" + cfg.Port
		log.Printf("Starting HTTP server on %s", addr)
		if err := router.Run(addr); err != nil {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Wait for interrupt signal
	<-quit
	log.Println("Shutting down server...")
	workerServer.Shutdown()
	log.Println("Server stopped")
}

func setupRoutes(router *gin.Engine, cfg *config.Config, workerClient *worker.Client) {
	// Root endpoint
	router.GET("/", handlers.TeapotHandler)

	// Health check
	router.GET("/healthy", handlers.HealthCheck)

	// Status
	statusHandler := handlers.NewStatusHandler(database.DB)
	router.GET("/status", statusHandler.Show)

	// Token
	tokenHandler := handlers.NewTokenHandler(database.DB)
	router.GET("/token", tokenHandler.Show)

	// Leaderboard
	leaderboardHandler := handlers.NewLeaderboardHandler(database.DB)
	router.GET("/leaderboard", leaderboardHandler.Show)

	// Contenders
	contendersHandler := handlers.NewContendersHandler(database.DB)
	router.GET("/contenders", contendersHandler.Show)

	// Round journal
	roundHandler := handlers.NewRoundHandler(database.DB)
	router.GET("/journal/:battle_id/:round_num", roundHandler.Show)

	// Program submission
	programHandler := handlers.NewProgramHandler(database.DB, cfg.MaxProgramsPerPlayer, workerClient)
	router.POST("/program", programHandler.Create)
	router.POST("/load_program", programHandler.LoadProgram)

	// Test round
	testRoundHandler := handlers.NewTestRoundHandler(database.DB)
	router.POST("/test_round", testRoundHandler.Create)
	router.POST("/test_round_p2existing", testRoundHandler.Create)

	// Tournament
	tournamentHandler := handlers.NewTournamentHandler(workerClient)
	router.POST("/tournament/rerun", tournamentHandler.TriggerFullTournament)

	// Error routes
	router.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"error": "Not found"})
	})
}
