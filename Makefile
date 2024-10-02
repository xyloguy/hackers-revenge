up:
	docker compose up -d

down:
	docker compose down

reset:
	make down
	rm -f hackers-revenge-server/db/development.sqlite3
	make up

