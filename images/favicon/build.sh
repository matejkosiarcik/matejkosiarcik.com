#!/bin/sh
set -euf
cd "$(dirname "${0}")"

output_directory='artifacts'
mkdir -p "${output_directory}"

svg2png() {
    inputFile='original/favicon.svg'
    outputFile="${output_directory}/${1}.png"
    # outputFile="$(node -e "console.log(require('path').resolve('.', '${outputFile}'))")" # absolute path
    width="${2}"
    height="${2}"

    printf '%s\n' "$(basename "${outputFile}")"
    rsvg-convert -f png -w "${width}" -h "${height}" "${inputFile}" -o "${outputFile}"
    pngquant --strip --speed 1 --skip-if-larger --quality 0-90 --force "${outputFile}" --output "${outputFile}"
    # docker run --interactive --volume "${PWD}/${outputFile}:/file.png" matejkosiarcik/millipng --brute
    printf '\n'
}

svg2png '.favicon-16' 16
svg2png '.favicon-32' 32
svg2png 'favicon' 64
svg2png 'apple-touch-icon' 180

# TODO: change this in millipng to be invoked simpler
# shellcheck disable=SC2016
find artifacts -iname '*.png' -print0 | xargs -0 -n 1 sh -c 'printf "%s\n" "-- ${1} --" && docker run --interactive --volume "${PWD}/${1}:/file.png" matejkosiarcik/millipng --brute' -

png2ico 'artifacts/favicon.ico' --colors 16 'artifacts/.favicon-16.png' 'artifacts/.favicon-32.png'
