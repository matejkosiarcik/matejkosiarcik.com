#!/bin/sh
set -euf
cd "$(dirname ${0})"

node build.js
convert -define icon:auto-resize=32,16 -background none -colors 256 -density 1000 'artifacts/favicon.png' 'artifacts/favicon.ico'
