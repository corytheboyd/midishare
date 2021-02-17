FROM node:14.15.5 AS node-base

FROM node-base AS development

WORKDIR /
COPY tsconfig.base.json .

WORKDIR /code
COPY projects/inspector/package.json .
COPY projects/inspector/package-lock.json .
RUN npm ci
COPY projects/inspector .

ENTRYPOINT ["./node_modules/.bin/parcel", "serve", "src/index.html"]
