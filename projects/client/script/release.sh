#!/usr/bin/env bash

set -euo pipefail

export SENTRY_ORG=midishare
export SENTRY_PROJECT=midishare-client

# https://docs.sentry.io/product/cli/releases/#sentry-cli-sourcemaps
sentry-cli releases files "$GIT_REV" upload-sourcemaps /usr/share/nginx/html
