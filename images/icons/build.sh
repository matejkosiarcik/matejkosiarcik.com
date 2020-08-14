#!/bin/sh
set -euf
cd "$(dirname "${0}")"

mkdir -p artifacts
node build.js
