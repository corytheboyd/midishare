FROM node:14.15.3 AS node-base

FROM node-base AS development

WORKDIR /code/@midishare/keyboard
COPY projects/@midishare/keyboard/package.json .
COPY projects/@midishare/keyboard/package-lock.json .
RUN npm ci
COPY projects/@midishare/keyboard .

WORKDIR /code/app
COPY projects/client/package.json .
COPY projects/client/package-lock.json .
RUN npm ci
COPY projects/client .

ENTRYPOINT ["./node_modules/.bin/parcel", "serve", "src/index.html"]
