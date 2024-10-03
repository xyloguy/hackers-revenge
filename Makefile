up:
	docker compose up -d

down:
	docker compose down

reset:
	make down
	rm -f hackers-revenge-server/config/master.key
	make up

