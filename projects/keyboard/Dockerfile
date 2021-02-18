FROM node:14.15.5 AS node-base

FROM node-base AS development

WORKDIR /
COPY tsconfig.base.json .

WORKDIR /code/app
COPY projects/keyboard/package.json .
COPY projects/keyboard/package-lock.json .
RUN npm ci
COPY projects/keyboard .

ENTRYPOINT ["./docker-entrypoint.sh"]
