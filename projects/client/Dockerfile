FROM node:14.15.5 AS base

WORKDIR /
COPY tsconfig.base.json .

WORKDIR /code/common
COPY projects/common/package.json .
COPY projects/common/package-lock.json .
RUN npm link

WORKDIR /code/keyboard
COPY projects/keyboard/package.json .
COPY projects/keyboard/package-lock.json .
RUN npm link

WORKDIR /code/app
COPY projects/client/package.json .
COPY projects/client/package-lock.json .
RUN npm ci
RUN npm link @midishare/common @midishare/keyboard

COPY projects/common /code/common
COPY projects/keyboard /code/keyboard
COPY projects/client /code/app

FROM base AS development

ENTRYPOINT ["./docker-entrypoint.sh"]

FROM base AS build

ARG GIT_REV
ENV GIT_REV=${GIT_REV}
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG SERVER_URL
ENV SERVER_URL=${SERVER_URL}
ARG PUBLIC_URL
ENV PUBLIC_URL=${PUBLIC_URL}
ARG PUBLIC_CDN_URL
ENV PUBLIC_CDN_URL=${PUBLIC_CDN_URL}
ARG STATIC_CDN_URL
ENV STATIC_CDN_URL=${STATIC_CDN_URL}
ARG WS_URL
ENV WS_URL=${WS_URL}

WORKDIR /code/common
RUN npm run build

WORKDIR /code/keyboard
RUN npm run build

WORKDIR /code/app
RUN $(npm bin)/parcel build --public-url $PUBLIC_CDN_URL src/index.html

FROM nginx:1.19.7-alpine AS production

COPY --from=build /code/app/dist /usr/share/nginx/html/
COPY projects/client/CHECKS .
COPY projects/client/nginx /etc/nginx
#COPY projects/client/Procfile .
#COPY projects/client/script/ ./script/
