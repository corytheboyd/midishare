#!/bin/bash

set -euo pipefail

./node_modules/.bin/nodemon "$@" src/index.ts
