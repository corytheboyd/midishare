#!/bin/bash

set -euo pipefail

./node_modules/.bin/nodemon \
  --exec "./node_modules/.bin/ts-node" \
  "$@" \
  ./src/index.ts
