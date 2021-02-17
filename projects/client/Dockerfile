FROM node:14.15.5 AS base

WORKDIR /
COPY tsconfig.base.json .

WORKDIR /code/common
COPY projects/common/package.json .
COPY projects/common/package-lock.json .
RUN npm link

WORKDIR /code/keyboard
COPY projects/keyboard/package.json .
COPY projects/keyboard/package-lock.json .
RUN npm link

WORKDIR /code/app
COPY projects/client/package.json .
COPY projects/client/package-lock.json .
RUN npm ci
RUN npm link @midishare/common @midishare/keyboard

COPY projects/common /code/common
COPY projects/keyboard /code/keyboard
COPY projects/client /code/app

FROM base AS development

ENTRYPOINT ["./node_modules/.bin/parcel", "serve", "src/index.html"]

FROM base AS production

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG SERVER_URL
ENV SERVER_URL=${SERVER_URL}
ARG PUBLIC_URL
ENV PUBLIC_URL=${PUBLIC_URL}
ARG CDN_URL
ENV CDN_URL=${CDN_URL}
ARG WS_URL
ENV WS_URL=${WS_URL}

WORKDIR /code/common
RUN ./node_modules/.bin/rollup --config=rollup.config.js

WORKDIR /code/keyboard
RUN ./node_modules/.bin/rollup --config=rollup.config.js

WORKDIR /code/app
RUN /code/app/node_modules/.bin/parcel build src/index.html
