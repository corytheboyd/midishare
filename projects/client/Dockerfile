FROM node:14.15.3 AS node-base

FROM node-base AS development

WORKDIR /code/keyboard
COPY projects/keyboard/package.json .
COPY projects/keyboard/package-lock.json .
RUN npm ci

WORKDIR /code/app
COPY projects/client/package.json .
COPY projects/client/package-lock.json .
RUN npm ci

COPY projects/keyboard /code/keyboard
COPY projects/client /code/app

ENTRYPOINT ["./node_modules/.bin/parcel", "serve", "src/index.html"]
