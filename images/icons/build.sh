#!/bin/sh
set -euf
cd "$(dirname "${0}")"

output_directory='artifacts'
mkdir -p "$output_directory"

## Convert SVGs to PNGs ##

svg2png() {
    inputFile="${1}"
    outputFile="$output_directory/$(basename "$inputFile" .svg).png"
    # outputFile="$(node -e "console.log(require('path').resolve('.', '${outputFile}'))")" # absolute path
    width="${2}"
    height="${2}"

    printf '%s\n' "$(basename "$outputFile")"
    rsvg-convert -f png -w "$width" -h "$height" "$inputFile" -o "$outputFile"
    pngquant --strip --speed 1 --skip-if-larger --quality 0-90 --force "$outputFile" --output "$outputFile"
    # docker run --interactive --volume "${PWD}/${outputFile}:/file.png" matejkosiarcik/millipng --fast
    printf '\n'
}

node -e 'require("glob").sync("original/{placeholder,terminal,docker,warning}.svg").forEach(file => console.log(file))' | while read -r file; do
    svg2png "$file" 80
done

node -e 'require("glob").sync("original/{autodnd,zenplayer}.svg").forEach(file => console.log(file))' | while read -r file; do
    svg2png "$file" 100
done

# TODO: change this in millipng to be invoked simpler
# shellcheck disable=SC2016
find artifacts -iname '*.png' -print0 | xargs -0 -n 1 sh -c 'printf "%s\n" "-- ${1} --" && docker run --interactive --volume "${PWD}/${1}:/file.png" matejkosiarcik/millipng --brute' -
