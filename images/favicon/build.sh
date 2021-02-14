#!/bin/sh
set -euf
cd "$(dirname "${0}")"

mkdir -p 'artifacts'
node 'build.js'

optimize() {
    printf '%s\n' "${1}"
    pngquant --strip --speed 1 --skip-if-larger --quality 0-90 --force "${1}" --output "${1}"
    docker run --interactive --tty --volume "${PWD}/${1}:/file.png" matejkosiarcik/millipng --brute
    printf '\n'
}

optimize 'artifacts/.favicon-16.png'
optimize 'artifacts/.favicon-32.png'
optimize 'artifacts/favicon.png'
optimize 'artifacts/apple-touch-icon.png'
png2ico 'artifacts/favicon.ico' --colors 16 'artifacts/.favicon-16.png' 'artifacts/.favicon-32.png'
