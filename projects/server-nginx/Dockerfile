FROM nginx:1.19.6 AS nginx-base

COPY projects/server-nginx/etc /etc

RUN ln -s /etc/nginx/sites-available/midishare /etc/nginx/sites-enabled/midishare
