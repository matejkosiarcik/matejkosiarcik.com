#!/bin/sh

# link checker
blc_args='--follow --filter-level 3 --exclude https://www.linkedin.com --exclude https://linkedin.com https://matejkosiarcik.com'
blc --recursive ${blc_args}
curl -L https://matejkosiarcik.com/urllist.txt | xargs -n1 blc ${blc_args}

# mozzila observatory
observatory matejkosiarcik.com --zero --rescan --format report
observatory matejkosiarcik.com --format report --min-grade B+ --min-score 80

# webhint.io
curl -L https://matejkosiarcik.com/urllist.txt | xargs -n1 hint
