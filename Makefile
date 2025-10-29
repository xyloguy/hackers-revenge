.PHONY: up down reset help

# Default target
.DEFAULT_GOAL := help

# Show help
help:
	@echo "Available targets:"
	@echo ""
	@echo "  make up          - Start the server"
	@echo "  make down        - Stop the server"
	@echo "  make reset       - Reset the server/wipe Database"
	@echo ""

# Start the server
up:
	test -f docker-compose.yml || cp docker-compose.yml.example docker-compose.yml
	test -f hackers-revenge-ui/default.conf || cp hackers-revenge-ui/default.conf.example hackers-revenge-ui/default.conf
	test -f hackers-revenge-ui/ssl.conf || cp hackers-revenge-ui/ssl.conf.example hackers-revenge-ui/ssl.conf
	test -f htpasswd/leaderboard.conf || cp htpasswd/leaderboard.conf.example htpasswd/leaderboard.conf
	test -f htpasswd/replay.conf || cp htpasswd/replay.conf.example htpasswd/replay.conf
	test -f htpasswd/token.conf || cp htpasswd/token.conf.example htpasswd/token.conf
	docker compose up -d

# Stop the server
down:
	docker compose down

# Reset the server/wipe Database
reset:
	docker compose down -v -t 10
	docker compose rm -f -v
	docker volume prune -f -a
	docker volume rm -f hackers-revenge_mysql_data
