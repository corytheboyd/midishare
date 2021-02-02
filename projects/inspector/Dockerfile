FROM node:14.15.3 AS node-base

FROM node-base AS development

WORKDIR /code/common
COPY projects/common/tsconfig.base.json .

WORKDIR /code
COPY projects/inspector/package.json .
COPY projects/inspector/package-lock.json .
RUN npm ci
COPY projects/inspector .

ENTRYPOINT ["./node_modules/.bin/parcel", "serve", "src/index.html"]
