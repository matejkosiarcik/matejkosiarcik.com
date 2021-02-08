#!/bin/sh
set -euf

# TODO: miniy sitemap.txt

# build netlify config
cp 'netlify/_redirects' 'public/_redirects'
node 'netlify/_headers.js' >'public/_headers'
