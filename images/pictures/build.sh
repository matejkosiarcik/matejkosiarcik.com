#!/bin/sh
set -euf
cd "$(dirname "${0}")"

mkdir -p 'artifacts'

optimize() {
    printf 'Optimizing %s\n' "$(basename "${1}")"

    # convert to webp
    magick "original/${1}" -quality 80 -define webp:lossless=false -define webp:alpha-quality=10 -define webp:method=6 -define webp:use-sharp-yuv=true "artifacts/$(basename "${1}" .jpg).webp"

    # convert to jpg
    guetzli --quality 88 "original/${1}" "artifacts/$(basename "${1}")"
    exiftool -r -overwrite_original -all= "artifacts/$(basename "${1}")"
}

find 'original' -type f -iname '*.jpg' | while IFS= read -r file; do
    optimize "$(basename "${file}")"
done
