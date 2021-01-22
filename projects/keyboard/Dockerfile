FROM node:14.15.3 AS node-base

FROM node-base AS development

WORKDIR /code
COPY projects/keyboard/package.json .
COPY projects/keyboard/package-lock.json .
RUN npm install

WORKDIR /code/devapp
COPY projects/keyboard/devapp/package.json .
COPY projects/keyboard/devapp/package-lock.json .
RUN npm install

COPY projects/keyboard/ /code

ENTRYPOINT ["./node_modules/.bin/parcel", "serve", "src/index.html"]
