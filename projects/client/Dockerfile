FROM node:14.15.3 AS node-base

FROM node-base AS development

WORKDIR /code/keyboard
COPY projects/keyboard .
RUN npm link

WORKDIR /code/app
COPY projects/client/package.json .
COPY projects/client/package-lock.json .
RUN npm ci
COPY projects/client .
RUN npm link @midishare/keyboard

ENTRYPOINT ["./node_modules/.bin/parcel", "serve", "src/index.html"]
