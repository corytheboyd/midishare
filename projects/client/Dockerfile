FROM node:14.15.3 AS node-base

FROM node-base AS development

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
RUN npm link @midishare/common
RUN npm link @midishare/keyboard

COPY projects/common /code/common
COPY projects/keyboard /code/keyboard
COPY projects/client /code/app

ENTRYPOINT ["./node_modules/.bin/parcel", "serve", "src/index.html"]
