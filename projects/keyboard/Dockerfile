FROM node:14.15.3 AS node-base

FROM node-base AS development

WORKDIR /code/app
COPY projects/keyboard/package.json .
COPY projects/keyboard/package-lock.json .
RUN npm ci
COPY projects/keyboard .

ENTRYPOINT ["./node_modules/.bin/rollup", "--config=rollup.config.js"]
