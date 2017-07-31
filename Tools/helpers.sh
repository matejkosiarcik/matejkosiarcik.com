#
# helpers.sh
# Copyright © 2017 Matej Kosiarcik. All rights reserved.
# This file contains helper functions for other tools
#

# Specifies to ShellCheck what shell it should use for linting
# shellcheck shell=sh

# this removes excessive whitespace
# accepts 1 argument of file to format
strip() {
    printf "%s\n" "$(sed '/./,$!d' "${1}")" >"${1}"            # remove leading newlines
    printf "%s\n" "$(cat -s "${1}")" >"${1}"                   # strip multiple empty lines and trailing newlines
    printf "%s\n" "$(sed 's~[[:space:]]*$~~' <"${1}")" >"${1}" # remove trailing whitespace
}

# searches for passed command
# returns 0 if command was found, non-0 otherwise
# accepts 1 argument of command to look up
exists() {
    command -v "${1}" >/dev/null 2>&1
}

# checks if given tool exists
# print message if not
# accepts 1 argument of command to look up
# uses () instead of {} for function body because:
#  - we do not want to expose declared variables inside function
#  - and also to not override variables declared somewhere else
check() (
    exists "${1}"
    doesExist="${?}"
    if [ ! "${doesExist}" -eq "0" ]; then
        printf "%s\n" "warning: ${1} not found. (tool_not_found)"
    fi
    return "${doesExist}"
)

# helpers returning true/false
# accepts 2 arguments
#  - 1. is subject string to test, e.g. "/foo"
#  - 2. is test string, e.g. "/"
has_prefix() { case "${1}" in "${2}"*) true ;; *) false ;; esac; }
has_suffix() { case "${1}" in *"${2}") true ;; *) false ;; esac; }

# finds all files in current tree that satisfy conditions
# conditions:
#  - file must not be in ".git" directory
#  - file must not be ignored by command "git" when "git" is available
# prints out files that satisfy all conditions
# prints in style without leading "./"
# also works when command "git" is not found
# accepts 0 arguments
git_files() {
    find "." -type f -not -path "*.git/*" | while IFS= read -r file; do
        if exists git && git check-ignore "${file}" >/dev/null 2>&1; then continue; fi       # if git exists and ignores this file
        if has_prefix "${file}" "./"; then file="$(printf "%s\n" "${file}" | cut -c 3-)"; fi # remove leading ./ from file path
        printf "%s\n" "${file}"
    done
}
