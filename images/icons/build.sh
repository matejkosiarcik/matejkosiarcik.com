#!/bin/sh
set -euf
cd "$(dirname "${0}")"

find . -name '{terminal,placeholder}.svg' | sed -E 's~.*/~~' | while read -r file; do
    filename="$$(basename "$${file}" .svg)"
    sed 's~#333~#eee~g' <"$${file}" >"generated/$${filename}-dark.svg"
done
