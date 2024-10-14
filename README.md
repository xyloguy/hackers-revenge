HACKERS REVENGE
===============

This is a collection of projects used to power the super fun game called hackers revenge.

I have tried to make it as simple as possible to spin up the system and reset it when needed. As always things are a Work in Progress, so check back for additional improvements and updates!

I have striped out the notion of `email`, `real_names`, and `phone` from the `Players` objects from the original game because it better suited my needs and made setup easier. On request I could put this back in and display the UI that allows the user to visit the instruction page, to set their own name and contact information. (This was how MX originally designed it for Silicone Slopes). I found it was easier for me to just generate a token when a user comes to registration and print out a label with their token, program name, and QR code on it.

LICENSE MIT

### Steps to Get started

1. To start the server: `make up`
1. Go to `http://localhost/admin/token` and click the generate token (user: `beta`, pass: `yolo`) <--- these are set in the `hackers-revenge-ui/auth.conf` you can generate your own credentials by opening `htpasswd_gen.html` in a web browser.
1. Go to `http://localhost/` to the instructions page. Input your token, create/submit your program.
1. Go to `http://localhost/admin/replay` to see random battles of programs. (user: `replay`, pass: `yolo`)
1. Go to `http://localhost/admin/leaderboard` to see the top scores of programs. (user: `leaderboard`, pass: `yolo`)


### To Reset the system

1. `make down` to stop the server if it is running
2. (OPTIONAL) delete the files in hackers-revenge-server/vendor (except the .keep file)
3. (OPTIONAL) delete the containers, images, and volumes from docker. (I am not going to put instructions for this. IYKYK)
3. `make reset` this will delete the database and restart the servers.


## Set up SSL

For this to work, you must:
1.  Have a PUBLIC FACING DOMAIN, and server with port 80 open. 
   * pull the repo using git 
   * update `htpasswd/*.conf` files 
   * update `docker-compose.yml` file to set `DOMAIN_NAME` env to your domain name. 
   * start the server `make up`
2. Generate the certificates:
   * Run: `docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot -d hcf.xyloguy.org --dry-run` (replace `hcf.xyloguy.org` with your domain)
   * When prompted enter your email or type "c" and pressing enter.
   * Agree to the Terms of Service by typing "y" and pressing enter.
   * Wait for the command to complete, if no errors occurred run the command without the `--dry-run` flag.
3. Stop the server `make down`
4. update the `docker-compose.yml` file to use the `ssl.conf` instead of `default.conf` under the `ui` configuration (ie uncomment the ssl.conf definition and comment out the default.conf configuration)
   change:
   ```
    - ./hackers-revenge-ui/default.conf:/etc/nginx/templates/default.conf.template:ro
   ```
   to:
   ```
   - ./hackers-revenge-ui/ssl.conf:/etc/nginx/templates/default.conf.template:ro
   ```
5. Start the server `make up`
6. Renew Certificates
    * Let's Encrypt certificates last for three months, after which it is necessary to renew them. To renew certificates, execute the following command:
   ```
   docker compose run --rm certbot renew
   ```
