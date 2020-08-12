#!/bin/sh

# check links
blc --recursive --follow --filter-level 3 --exclude https://www.linkedin.com --exclude https://linkedin.com https://matejkosiarcik.com

# validate html
curl -L https://matejkosiarcik.com/urllist.txt | xargs -n1 html-validator --verbose --file
