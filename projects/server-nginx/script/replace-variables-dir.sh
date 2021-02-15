#!/bin/bash
set -eo pipefail

# See replace-variables.sh. Does the same thing, but recursively
# for all files in a source directory, written to a target
# directory.
#
# By default, if only a SOURCE_DIR is given, the files in that
# directory will be modified in place. This is a bit of a risky
# default behavior, I chose it because it fit my exact use-case
# at the time.
#
# Requires the script replace-variables.sh be in the same
# directory as this script.

# Enable **/*
shopt -s globstar dotglob;

# https://stackoverflow.com/a/246128/15193865
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

function usage() {
  echo "Usage: $(basename "$0") [SOURCE_DIR] [...SOURCE_DIR]" >&2
}

SOURCE_DIR="$1"
TARGET_DIR="${2:-"$SOURCE_DIR"}"
[ -z "$SOURCE_DIR" ] && usage && exit 2

# Create clean tmp directory
TMP_DIR=/tmp/replace-variables-dir
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
cp -R "$SOURCE_DIR" "$TMP_DIR"

HAS_ERROR=0

function process_file() {
  FILE="$1"
  if ! "$DIR"/replace-variables.sh "$FILE" > "$TMP_DIR"/"$FILE"; then
    HAS_ERROR=1
  fi
}

function process_dir() {
  # https://unix.stackexchange.com/a/139381
  while IFS= read -r -d '' -u 9
  do
    # Ensure subpath exists in the tmp directory first
    mkdir -p "$TMP_DIR$(dirname "$REPLY")"
    process_file "$REPLY"
  done 9< <( find "$SOURCE_DIR" -type f -exec printf '%s\0' {} + )
}

# Copy root level contents
process_dir "$SOURCE_DIR"

if [ $HAS_ERROR -eq 1 ]; then
  printf "\nFailed to replace all variables in directory, aborting!\n"
  rm -rf "$TMP_DIR"
  exit 1
fi

printf "\nSuccessfully replaced all variables in directory!\n"
mkdir -p "$TARGET_DIR"
echo "$TMP_DIR"/"$(basename "$SOURCE_DIR")"
echo "$TARGET_DIR"
cp -R "$TMP_DIR"/"$(basename "$SOURCE_DIR")"/* "$TARGET_DIR"
rm -rf "$TMP_DIR"
exit 0
