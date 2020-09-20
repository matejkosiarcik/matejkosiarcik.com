#!/bin/sh
set -euf
cd "$(dirname "${0}")"

mkdir -p 'artifacts'

optimize() {
    pngquant --strip --speed 1 --skip-if-larger --quality 0-90 --force "${1}" --output "${1}"
    optipng -force -strip all -o7 -zm1-9 "${1}" -out "${1}"
    zopflipng -y --iterations=1000 --filters=01234mepb --lossy_8bit --lossy_transparent "${1}" "${1}"

    # convert to webp
    magick "${1}" -quality 30 -define webp:lossless=false -define webp:alpha-quality=10 -define webp:method=6 "$(dirname "${1}")/$(basename "${1}" .png).webp"
}

convert -resize 80x80 -strip docker.png artifacts/docker.png
optimize 'artifacts/docker.png'
convert -resize 80x80 -strip docker-dark.png artifacts/docker-dark.png
optimize 'artifacts/docker-dark.png'

convert -resize 160x160 -strip docker.png artifacts/docker@2.png
optimize 'artifacts/docker@2.png'
convert -resize 160x160 -strip docker-dark.png artifacts/docker-dark@2.png
optimize 'artifacts/docker-dark@2.png'

convert -resize 240x240 -strip docker.png artifacts/docker@3.png
optimize 'artifacts/docker@3.png'
convert -resize 240x240 -strip docker-dark.png artifacts/docker-dark@3.png
optimize 'artifacts/docker-dark@3.png'
