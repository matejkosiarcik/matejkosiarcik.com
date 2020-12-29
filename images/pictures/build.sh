#!/bin/sh
set -euf
cd "$(dirname "${0}")"

mkdir -p 'artifacts'

optimize() {
    # convert to webp
    magick "original/${1}" -quality 80 -define webp:lossless=false -define webp:alpha-quality=10 -define webp:method=6 -define webp:use-sharp-yuv=true "artifacts/$(basename "${1}" .jpg).webp"

    # convert to jpg
    magick "original/${1}" -quality 85 "artifacts/$(basename "${1}")"
    exiftool -r -overwrite_original -all= "artifacts/$(basename "${1}")"
}

find 'original' -type f -iname '*.jpg' -print0 | while IFS= read -r -d '' file; do
    optimize "$(basename "${file}")"
done
