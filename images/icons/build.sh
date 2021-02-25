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

optimize 'artifacts/terminal.png'
optimize 'artifacts/placeholder.png'
optimize 'artifacts/docker.png'
optimize 'artifacts/warning.png'

optimize 'artifacts/autodnd.png'
optimize 'artifacts/zenplayer.png'
