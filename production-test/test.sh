#!/bin/sh

# check all pages navigable from root
# TODO: crank it to level 3
blc --recursive --follow --filter-level 1 --exclude https://www.linkedin.com --exclude https://linkedin.com https://matejkosiarcik.netlify.app

# check individual public pages
# TODO: enable
# curl -L https://matejkosiarcik.netlify.app/urllist.txt | xargs -n1 blc --follow --filter-level 3 --exclude https://www.linkedin.com --exclude https://linkedin.com
