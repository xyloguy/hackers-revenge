up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose run server bin/rails restart

reset:
	rm -f hackers-revenge-server/db/development.sqlite3
	make up

