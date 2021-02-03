FROM node:14.15.3 AS node-base

FROM node-base AS development

WORKDIR /
COPY tsconfig.base.json .

WORKDIR /code/keyboard
COPY projects/keyboard/package.json .
COPY projects/keyboard/package-lock.json .
RUN npm link

WORKDIR /code/app
COPY projects/docs/package.json .
COPY projects/docs/package-lock.json .
RUN npm ci
RUN npm link @midishare/keyboard

COPY projects/keyboard /code/keyboard
COPY projects/docs /code/app

ENTRYPOINT ["./node_modules/.bin/parcel", "src/index.html"]
