# shellcheck shell=sh
#
# This file is part of personal-website which is released under MIT license.
# See file LICENSE.txt or go to https://github.com/matejkosiarcik/personal-website for full license details.
#

# setup
set -euf
. "./utils/internal/helpers.sh"

# parse arguments
while getopts "o:" argument; do
    case "${argument}" in o) output="${OPTARG}" ;; esac
done

if [ -z "${output}" ]; then
    printf "%s\n" "Output path not supplied."
    exit 1
fi

cp "./node_modules/normalize.css/normalize.css" "./${output}/_include/styles/normalize.css"
