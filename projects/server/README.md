# Server

## Production

```
# https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04
adduser node
usermod -aG sudo node
rsync --archive --chown=node:node ~/.ssh /home/node

# https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04
# install nodejs
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install -y nodejs
sudo apt install build-essential

# https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04

# setup PM2
# moved to deployment script, but maybe that is too much

# SQlite
# I just downloaded the empty database checked in to source control to the root of the project.
cd ~/server
wget https://github.com/corytheboyd/midishare/raw/rewrite/db/database.db
```

### Deployment

```
# pretty much just follow this https://gist.github.com/RobertMcReed/c6963a09962adf22c91e7c1370dffc13
# install pm2 on remote server
sudo npm i -g pm2@4.5.4
```
