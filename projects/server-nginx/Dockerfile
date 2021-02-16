FROM nginx:1.19.6-perl AS nginx-base

COPY ./projects/server-nginx/ .

ARG SERVER_URL
ENV SERVER_URL=${SERVER_URL}

# Replace environemnt variables in template source files and move
# to /etc/nginx
COPY ./script script
RUN ./script/replace-variables /etc/nginx /etc/nginx

# Enable the vhost. See documentation of sites-[available|enabled]
# https://wiki.debian.org/Nginx/DirectoryStructure
RUN ln -s /etc/nginx/sites-available/midishare /etc/nginx/sites-enabled/midishare
