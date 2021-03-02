FROM node:14.15.5 AS base

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

CMD ./node_modules/.bin/ts-node src/index.ts

FROM base AS build

WORKDIR /code/common
RUN npm run build

WORKDIR /code/app
RUN npm run build
RUN rm -rf node_modules

FROM build AS production

WORKDIR /app
COPY --from=build /code/app/dist/ .
COPY db/migrations/ /db/migrations/

CMD node index.js
