HACKERS REVENGE
===============

This is a collection of projects used to power the super fun game called hackers revenge. You need both of these to run and you'll need to piece the apps together but there are enough breadcrumbs to make this happen.

LICENSE MIT


Working to make this easier.

## Steps

1. Run `make initialize` to copy default sample configuration
2. Run `make server` to build the server docker container
3. Run `make ui` to build the frontend nginx docker container
4. Run `make build` to do initial migration for server
5. Run `docker compose up` to run the server, ui, and sidekiq
6. Run `chown $USER:$USER hackers-revenge-server/db/development.sqlite3`
7. Go to `localhost:8080/mx/token` and click the generate token (username: beta, password: yolo) <--- these are set in the hackers-revenge-ui/auth.conf
8. Connect to the `hackers-revenge-server/db/development.sqlite3` database using dbeaver or cli
9. Run `SELECT * FROM players;` to see the `id` of the token/player you generated
10. RUN `UPDATE players set email = 'whatever@domain.gom' where token = '{token}';` // email is a required field (for now)
11. Go to `localhost:8080/mxmax` to the instructions page
12. Input your token, create/submit your program.
13. Go to `localhost:8080/mx/replay` to see random battles of programs