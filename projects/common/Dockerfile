FROM node:14.15.5 AS node-base

FROM node-base AS development

WORKDIR /
COPY tsconfig.base.json .

WORKDIR /code/app
COPY projects/common/package.json .
COPY projects/common/package-lock.json .
RUN npm ci
COPY projects/common .

ENTRYPOINT ["./docker-entrypoint.sh"]
