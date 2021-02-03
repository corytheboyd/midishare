FROM node:14.15.3 AS node-base

FROM node-base AS development

WORKDIR /
COPY tsconfig.base.json .

WORKDIR /code/app
COPY projects/common/package.json .
COPY projects/common/package-lock.json .
RUN npm ci
COPY projects/common .

ENTRYPOINT ["./node_modules/.bin/rollup", "--config=rollup.config.js"]
