.PHONY: build run test clean install docker-build docker-run docker-stop docker-logs rerun help

# Default target
.DEFAULT_GOAL := help

# Show help
help:
	@echo "Available targets:"
	@echo ""
	@echo "  make build          - Build the server binary"
	@echo "  make run            - Run the server locally"
	@echo "  make test           - Run tests"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make install        - Install dependencies"
	@echo "  make migrate        - Show migration info"
	@echo "  make fmt            - Format code"
	@echo "  make lint           - Lint code (requires golangci-lint)"
	@echo "  make dev            - Run with hot reload (requires air)"
	@echo ""
	@echo "Docker commands (run from hackers-revenge-go/):"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run with docker-compose"
	@echo "  make docker-stop    - Stop Docker container"
	@echo "  make docker-logs    - View Docker logs"
	@echo "  make docker-shell   - Open shell in container"
	@echo "  make docker-run-both - Run both Rails and Go servers"
	@echo ""
	@echo "Tournament commands:"
	@echo "  make rerun          - Trigger full tournament with all players"
	@echo ""

# Build the server
build:
	go build -o bin/server cmd/server/main.go

# Run the server
run:
	go run cmd/server/main.go

# Run tests
test:
	go test -v ./...

# Clean build artifacts
clean:
	rm -rf bin/

# Install dependencies
install:
	go mod download
	go mod tidy

# Run database migrations
migrate:
	@echo "Migrations should be handled by your database migration tool"
	@echo "The existing Rails migrations in ../hackers-revenge-server/db/migrate/ can be used"

# Format code
fmt:
	go fmt ./...

# Lint code (requires golangci-lint)
lint:
	golangci-lint run

# Run in development mode with hot reload (requires air)
dev:
	air

# Docker commands (run from project root)
docker-build:
	docker build -t hackers-revenge-go .

docker-run:
	@echo "Starting Go server with docker-compose..."
	@cd .. && docker-compose up server-go

docker-stop:
	@cd .. && docker-compose stop server-go

docker-logs:
	@cd .. && docker-compose logs -f server-go

docker-shell:
	@cd .. && docker-compose exec server-go sh

# Run both Rails and Go servers for comparison
docker-run-both:
	@cd .. && docker-compose up server server-go

# Trigger a full tournament rerun
rerun:
	@echo "Triggering full tournament rerun..."
	@cd .. && docker-compose exec -T server curl -s -X POST http://localhost:3000/tournament/rerun | grep -q "queued" && \
		echo "✓ Tournament queued successfully!" && \
		echo "" && \
		echo "Monitor progress with:" && \
		echo "  make docker-logs | grep -i tournament" && \
		echo "" && \
		echo "Check updated leaderboard:" && \
		echo "  cd .. && docker-compose exec server curl -s http://localhost:3000/leaderboard | jq '.leaders'" || \
		echo "✗ Failed to queue tournament"
