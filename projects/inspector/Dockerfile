FROM node:14.15.5 AS base

WORKDIR /
COPY tsconfig.base.json .

WORKDIR /code/app
COPY projects/inspector/package.json .
COPY projects/inspector/package-lock.json .
RUN npm ci
COPY projects/inspector .

FROM base AS development

ENTRYPOINT ["./docker-entrypoint.sh"]

FROM base AS build

ARG PUBLIC_CDN_URL
ENV PUBLIC_CDN_URL=${PUBLIC_CDN_URL}

RUN ./node_modules/.bin/parcel build --public-url $PUBLIC_CDN_URL src/index.html

FROM nginx:1.19.7-alpine AS production

COPY --from=build /code/app/dist /usr/share/nginx/html/
COPY projects/inspector/CHECKS .
COPY projects/inspector/nginx /etc/nginx
