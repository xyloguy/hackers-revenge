HACKERS REVENGE
===============

This is a collection of projects used to power the super fun game called hackers revenge. You need both of these to run and you'll need to piece the apps together but there are enough breadcrumbs to make this happen.

LICENSE MIT


Working to make this easier.

## Steps

1. To start: `make up`
1. Go to `http://localhost/admin/token` and click the generate token (username: beta, password: yolo) <--- these are set in the hackers-revenge-ui/auth.conf you can generate your own credentials by opening htpasswd_gen.html in a web browser.
1. (OPTIONAL) Run `chown $USER:$USER hackers-revenge-server/db/development.sqlite3`
1. (OPTIONAL) Connect to the `hackers-revenge-server/db/development.sqlite3` database using dbeaver or cli
1. (OPTIONAL) Run `SELECT * FROM players;` to see the `id` of the token/player you generated
1. Go to `http://localhost/` to the instructions page
1. Input your token, create/submit your program.
1. Go to `http://localhost/admin/replay` to see random battles of programs