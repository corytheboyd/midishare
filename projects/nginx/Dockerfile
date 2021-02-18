FROM nginx:1.19.6-perl

ARG API_SERVER_URL
ENV API_SERVER_URL=${API_SERVER_URL}
ARG API_DOMAIN
ENV API_DOMAIN=${API_DOMAIN}
ARG WWW_DOMAIN
ENV WWW_DOMAIN=${WWW_DOMAIN}
ARG WWW_SERVER_URL
ENV WWW_SERVER_URL=${WWW_SERVER_URL}
ARG SSL_CERT_PATH
ENV SSL_CERT_PATH=${SSL_CERT_PATH}
ARG SSL_KEY_PATH
ENV SSL_KEY_PATH=${SSL_KEY_PATH}
ARG SERVER_NAME
ENV SERVER_NAME=${SERVER_NAME}

COPY ./projects/nginx/ .

# Replace environemnt variables in template source files and move
# to /etc/nginx
COPY ./script script
RUN ./script/replace-variables /etc/nginx /etc/nginx

# Enable the vhost. See documentation of sites-[available|enabled]
# https://wiki.debian.org/Nginx/DirectoryStructure
RUN ln -s /etc/nginx/sites-available/api.midishare /etc/nginx/sites-enabled/
RUN ln -s /etc/nginx/sites-available/www.midishare /etc/nginx/sites-enabled/

# TODO Maybe this https://amplify.nginx.com/dashboard/
#RUN curl -L -O https://github.com/nginxinc/nginx-amplify-agent/raw/master/packages/install.sh && \
#    API_KEY='LOLOLOL' sh ./install.sh && \
#    rm install.sh;
