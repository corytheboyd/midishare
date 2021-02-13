#!/bin/bash

set -euo pipefail

awk '
BEGIN {
	pattern = "{{([0-9a-zA-Z_-]+)}}"
  exit_code = 0
}

{
  match($0, pattern);
  if (RLENGTH >= 0) {
    name = substr($0, RSTART + 2, RLENGTH - 4)
    value = ENVIRON[name]
    if (value) {
      gsub(pattern, value)
      print
    } else {
      printf "\033[31m%s: unset variable\033[0m\n", FILENAME
      formatted_start = substr($0, 0, RSTART - 1);
      formatted_mid = substr($0, RSTART, RLENGTH);
      formatted_end = substr($0, RSTART + RLENGTH, length($0) - 1);
      printf "\033[2m%d: \033[0m%s\033[1m\033[91m%s\033[0m%s\n", FNR, formatted_start, formatted_mid, formatted_end
      exit_code = 1
    }
  }
}

END {
  exit exit_code
}
' "$@"

exit $?
