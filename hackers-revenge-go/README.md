# Hackers Revenge - Go Server

This is a Go port of the Hackers Revenge game server, originally written in Ruby on Rails.

## Overview

Hackers Revenge is a programming game where players submit assembly-like programs that battle each other in shared memory, similar to Core War.

## Architecture

- **Gin**: Web framework for HTTP routing
- **GORM**: ORM for database access
- **MySQL**: Database backend (compatible with existing schema)
- **Asynq**: Background job processing (replaces Sidekiq)
- **Redis**: Job queue backend
- **Concurrent Tournament Processing**: 20 goroutines compute battles in memory, then batch write to database
  - Eliminates database deadlocks
  - ~1 second for top 20 players (1,900 battles, 10 effective per pair with bidirectional)
  - Scales to 100+ players in database (only top 20 compete in tournaments)

## Project Structure

```
hackers-revenge-go/
├── cmd/
│   └── server/          # Main application entry point
├── internal/
│   ├── config/          # Configuration management
│   ├── database/        # Database connection and setup
│   ├── engine/          # Game engine (RunningProgram, MemoryCell, Cycle)
│   ├── handlers/        # HTTP handlers (controllers)
│   ├── models/          # Database models
│   └── worker/          # Background job workers
├── migrations/          # Database migrations
└── api/                 # API documentation
```

## Setup

### Option 1: Docker (Recommended)

1. From the project root directory:
   ```bash
   docker-compose up server-go
   ```

2. The server will be available at http://localhost:3001

See [DOCKER.md](DOCKER.md) for detailed Docker instructions.

### Option 2: Native Go

1. Copy `.env.example` to `.env` and configure your database
2. Run `go mod download` to install dependencies
3. Run database migrations (use existing Rails migrations)
4. Start the server with `go run cmd/server/main.go`

## API Endpoints

- `GET /healthy` - Health check
- `GET /status` - Server status
- `GET /token` - Get player token
- `GET /leaderboard` - View leaderboard
- `GET /contenders` - View recent contenders
- `GET /journal/:battle_id/:round_num` - View battle replay
- `POST /program` - Submit a program
- `POST /load_program` - Load previous program
- `POST /test_round` - Test program against opponent
- `POST /tournament/rerun` - Trigger full tournament with top 20 players (see [TOURNAMENT_RERUN.md](TOURNAMENT_RERUN.md))

## Development

```bash
# Install dependencies
go mod download

# Run tests
go test ./...

# Run server
go run cmd/server/main.go

# Build
go build -o bin/server cmd/server/main.go

# Trigger full tournament rerun (all players compete)
make rerun
```

See `make help` for all available commands.
