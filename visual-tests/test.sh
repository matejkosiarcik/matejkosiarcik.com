#!/bin/sh
set -euf

cd "$(dirname "$0")"
rm -rf 'node_modules'

if [ -z "${BASE_URL+x}" ]; then
    printf 'BASE_URL not set\n'
    exit 1
fi

docker run --volume "$PWD:/src" --env "BASE_URL=$BASE_URL" mcr.microsoft.com/playwright:focal sh -c 'cd /src && npm ci && npm test'
