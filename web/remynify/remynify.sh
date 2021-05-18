#!/bin/sh
set -euf

source="$1"
srcdir="$PWD"

tmpdir="$(mktemp -d)"
cp "$source" "$tmpdir/file.css"
cd "$tmpdir"

run_clean() {
    cleancss -O2 "$1.css" --output "$1-clean.css"
}

run_nano() {
    cssnano "$1.css" "$1-nano.css"
}

run_csso() {
    csso --comments none --force-media-merge --input "$1.css" --output "$1-csso.css"
}

run_crass() {
    crass "$1.css" --css4 >"$1-crass.css"
}

# 1

run_clean file
run_nano file
run_csso file
run_crass file

# 2

run_clean file-nano
run_clean file-csso
run_clean file-crass

run_nano file-clean
run_nano file-csso
run_nano file-crass

run_csso file-clean
run_csso file-nano
run_csso file-crass

run_crass file-clean
run_crass file-nano
run_crass file-csso

# 3

run_clean file-nano-csso
run_clean file-csso-nano
run_clean file-csso-crass
run_clean file-crass-csso
run_clean file-nano-crass
run_clean file-crass-nano

run_nano file-clean-csso
run_nano file-csso-clean
run_nano file-clean-crass
run_nano file-crass-clean
run_nano file-crass-csso
run_nano file-csso-crass

run_csso file-clean-nano
run_csso file-nano-clean
run_csso file-clean-crass
run_csso file-crass-clean
run_csso file-crass-nano
run_csso file-nano-crass

run_crass file-clean-nano
run_crass file-nano-clean
run_crass file-clean-csso
run_crass file-csso-clean
run_crass file-csso-nano
run_crass file-nano-csso

# 4

run_clean file-nano-csso-crass
run_clean file-csso-nano-crass
run_clean file-csso-crass-nano
run_clean file-crass-csso-nano
run_clean file-nano-crass-csso
run_clean file-crass-nano-csso

run_nano file-clean-csso-crass
run_nano file-csso-clean-crass
run_nano file-clean-crass-csso
run_nano file-crass-clean-csso
run_nano file-crass-csso-clean
run_nano file-csso-crass-clean

run_csso file-clean-nano-crass
run_csso file-nano-clean-crass
run_csso file-clean-crass-nano
run_csso file-crass-clean-nano
run_csso file-crass-nano-clean
run_csso file-nano-crass-clean

run_crass file-clean-nano-csso
run_crass file-nano-clean-csso
run_crass file-clean-csso-nano
run_crass file-csso-clean-nano
run_crass file-csso-nano-clean
run_crass file-nano-csso-clean

# results

find . -name '*.css' -and -not -name '*-*.css' -print0 | xargs -0 wc
printf '\n'
find . -name '*-*.css' -and -not -name '*-*-*.css' -print0 | xargs -0 wc
printf '\n'
find . -name '*-*-*.css' -and -not -name '*-*-*-*.css' -print0 | xargs -0 wc
printf '\n'
find . -name '*-*-*-*.css' -and -not -name '*-*-*-*-*.css' -print0 | xargs -0 wc
printf '\n'
find . -name '*-*-*-*-*.css' -and -not -name '*-*-*-*-*-*.css' -print0 | xargs -0 wc

smallest_file="$(find . -type f -name '*.css' -print0 | xargs -0 wc -c | sort --numeric-sort | head -n1 | tr -s ' ' | cut -d ' ' -f 3)"
printf '%s %s\n' "$smallest_file" "$(wc -c <"$smallest_file")"

cd "$srcdir"
cp "$tmpdir/$smallest_file" "$source"
rm -rf "$tmpdir"
