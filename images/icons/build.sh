#!/bin/sh
set -euf
cd "$(dirname "$0")"

output_directory='artifacts'
mkdir -p "$output_directory"

# generate dark/light mode variants
find 'original' -name '*.svg' | while read -r file; do
    # only remove media from svgs that actually contain dark-mode media queries
    if grep '@media (prefers-color-scheme: dark)' <"$file" >/dev/null 2>&1; then
        # shellcheck disable=SC2094
        perl -0pe 's~\@media *\(prefers-color-scheme: *dark\) *\{([\s\S]*?\})\s*\}~\1~gms' <"$file" >"artifacts/$(basename "$file" .svg)-dark.svg"
        # shellcheck disable=SC2094
        perl -0pe 's~\@media *\(prefers-color-scheme: *dark\) *\{[\s\S]*?\}\s*\}~~gms' <"$file" >"artifacts/$(basename "$file" .svg)-light.svg"
    fi
done
