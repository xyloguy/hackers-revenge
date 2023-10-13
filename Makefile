
server:
	docker build -t hackers-revenge-server hackers-revenge-server/

ui:
	docker build -t hackers-revenge-ui hackers-revenge-ui/

initialize:
	cp hackers-revenge-server/config/database.yml.sample hackers-revenge-server/config/database.yml
	cp hackers-revenge-server/config/sidekiq.yml.sample hackers-revenge-server/config/sidekiq.yml

build:
	docker run -it hackers-revenge-server bin/setup
