FROM node:14.15.3 AS base

WORKDIR /
COPY tsconfig.base.json .

WORKDIR /code/common
COPY projects/common/package.json .
COPY projects/common/package-lock.json .
RUN npm link

WORKDIR /code/app
COPY projects/server/package.json .
COPY projects/server/package-lock.json .
RUN npm ci
RUN npm link @midishare/common

COPY projects/server /code/app
COPY projects/common /code/common

FROM base AS development

ENTRYPOINT ["./docker-entrypoint.sh"]

FROM base AS production

WORKDIR /code/common
RUN ./node_modules/.bin/rollup --config=rollup.config.js

WORKDIR /code/app
RUN ./node_modules/.bin/ncc build src/index.ts --out=dist --source-map
