#!/usr/bin/env bash

set -euo pipefail

export SENTRY_PROJECT=midishare-server

# https://docs.sentry.io/product/cli/releases/#sentry-cli-sourcemaps
sentry-cli releases files "$GIT_REV" upload-sourcemaps /app/dist \
  --strip-prefix "/app/webpack:/@midishare/server/"
