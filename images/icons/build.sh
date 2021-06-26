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
        perl -0pe 's~\@media *\(prefers-color-scheme: *dark\) *\{([\s\S]*?\})\s*\}~\1~gms' <"$file" >"$output_directory/$(basename "$file" .svg)-dark.svg"
        # shellcheck disable=SC2094
        perl -0pe 's~\@media *\(prefers-color-scheme: *dark\) *\{[\s\S]*?\}\s*\}~~gms' <"$file" >"$output_directory/$(basename "$file" .svg)-light.svg"
    else
        cp "$file" "$output_directory/$(basename "$file")"
    fi
done

# optimize svgs with svgcleaner
find "$output_directory" -name '*.svg' | while read -r file; do
    svgcleaner --apply-transform-to-paths yes --coordinates-precision 1 --properties-precision 1 --transforms-precision 1 --paths-coordinates-precision 1 "$file" "$file"
done
