#!/bin/bash
set -euo pipefail

# Replaces {{VARIABLE}} instances in the input file(s)
# with the value of the corresponding environment
# variable.
#
# Error messages are sent to /dev/stderr.
#
# Example:
# $ echo "Hello, {{OBJECT}}!" > "test.txt"
# $ replace-variables.sh test.txt
#   test.txt: unset variable
#   1: Hello, {{OBJECT}}!
# $ OBJECT=world replace-variables.sh test.txt
#   Hello, world!
#
# Also accepts input from stdin.
# Example:
# $ echo "Aww gee {{NAME}}" | replace-variables.sh test.txt
#   -:unset variable
#   Aww gee {{NAME}}
# $ echo "Aww gee {{NAME}}" | NAME=Rick replace-variables.sh test.txt
#   Aww gee Rick

awk '
BEGIN {
	pattern = "{{([0-9a-zA-Z_-]+)}}"
  exit_code = 0
  has_errors = 0
}
{
  match($0, pattern);
  if (RLENGTH >= 0) {
    name = substr($0, RSTART + 2, RLENGTH - 4)
    value = ENVIRON[name]
    if (value) {
      gsub(pattern, value)
    } else {
      if (has_errors == 0) {
        has_errors = 1
        printf "\n\033[31mVariable substitution failed!\033[0m\n\n"
      }

      printf "\033[31m%s: unset variable\033[0m\n", FILENAME > "/dev/stderr"
      fmt_0 = substr($0, 0, RSTART - 1);
      fmt_1 = substr($0, RSTART, RLENGTH);
      fmt_2 = substr($0, RSTART + RLENGTH, length($0) - 1);
      printf "\033[2m%d: \033[0m%s\033[1m\033[91m%s\033[0m%s\n", FNR, fmt_0, fmt_1, fmt_2  > "/dev/stderr"
      exit_code = 1
    }
  }
  if (has_errors == 0) {
    print > "/dev/stdout"
  }
}
END {
  exit exit_code
}
' "$@"

exit $?
