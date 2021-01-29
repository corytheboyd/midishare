FROM node:14.15.3 AS node_base

FROM node_base AS development

# TODO This common directory is a mess of concerns
COPY projects/common/tsconfig.base.json /code/common/

WORKDIR /code/app
COPY projects/server/package.json .
COPY projects/server/package-lock.json .
RUN npm ci
COPY projects/server .

ENTRYPOINT ["./node_modules/.bin/ts-node-dev", "src/index.ts"]
