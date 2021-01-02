FROM node:14.15.3 AS node-base

RUN mkdir -p /code/app && \
    mkdir -p /code/common && \
    chown -R node /code
USER node

WORKDIR /code/common
COPY --chown=node projects/common .

WORKDIR /code/app
COPY --chown=node projects/client/package-lock.json .
COPY --chown=node projects/client/package.json .
RUN npm ci
COPY --chown=node projects/client .

FROM node-base AS development
CMD npm start

FROM node-base AS production-build
RUN npm build

FROM node:14.15.3-alpine AS production
WORKDIR /code/build
COPY --from=production-build /code/app/build .

RUN npm ci --production && npm cache clear --force
CMD ./node_modules/.bin/http-server .
