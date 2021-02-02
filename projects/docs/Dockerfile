FROM node:14.15.3 AS node_base

FROM node-base AS development

WORKDIR /code/app
COPY projects/docs/package.json .
COPY projects/docs/package-lock.json .
RUN npm ci

ENTRYPOINT ["./node_modules/.bin/parcel", "src/index.html"]
