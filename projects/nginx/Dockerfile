FROM nginx:1.19.6-perl AS nginx-base

COPY ./projects/nginx/ .

ARG SERVER_URL
ENV SERVER_URL=${SERVER_URL}
ARG SSL_CERT_PATH
ENV SSL_CERT_PATH=${SSL_CERT_PATH}
ARG SSL_KEY_PATH
ENV SSL_KEY_PATH=${SSL_KEY_PATH}
ARG SERVER_NAME
ENV SERVER_NAME=${SERVER_NAME}

# Replace environemnt variables in template source files and move
# to /etc/nginx
COPY ./script script
RUN ./script/replace-variables /etc/nginx /etc/nginx

# Enable the vhost. See documentation of sites-[available|enabled]
# https://wiki.debian.org/Nginx/DirectoryStructure
RUN ln -s /etc/nginx/sites-available/midishare.conf /etc/nginx/sites-enabled/

# TODO Maybe this https://amplify.nginx.com/dashboard/
#RUN curl -L -O https://github.com/nginxinc/nginx-amplify-agent/raw/master/packages/install.sh && \
#    API_KEY='LOLOLOL' sh ./install.sh && \
#    rm install.sh;
