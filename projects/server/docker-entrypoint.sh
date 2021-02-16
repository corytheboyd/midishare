#!/bin/bash
set -euo pipefail

./node_modules/.bin/pm2 start ecosystem.config.js
./node_modules/.bin/pm2 logs
