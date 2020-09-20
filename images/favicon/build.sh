#!/bin/sh
set -euf
cd "$(dirname "${0}")"

mkdir -p 'artifacts'
node 'build.js'

optimize() {
    pngquant --strip --speed 1 --skip-if-larger --quality 0-90 --force "${1}" --output "${1}"
    docker run -v "${PWD}/${1}:/file.png" matejkosiarcik/redopng
}

optimize 'artifacts/.favicon-16.png'
optimize 'artifacts/.favicon-32.png'
optimize 'artifacts/.favicon-48.png'
optimize 'artifacts/.favicon-64.png'
optimize 'artifacts/apple-touch-icon.png'
cp 'artifacts/.favicon-64.png' 'artifacts/favicon.png'
png2ico 'artifacts/favicon.ico' --colors 16 'artifacts/.favicon-16.png' 'artifacts/.favicon-32.png'
