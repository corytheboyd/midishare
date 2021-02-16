#!/bin/bash

set -euo pipefail

./node_modules/.bin/vcc watch "$@" src/index.ts
