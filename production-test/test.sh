#!/bin/sh
# shellcheck disable=SC2086

# link checker
blc_args='--follow --filter-level 3 --exclude https://www.linkedin.com --exclude https://linkedin.com https://matejkosiarcik.com'
blc --recursive ${blc_args}
curl -L https://matejkosiarcik.com/urllist.txt | xargs -n1 blc ${blc_args}

# mozzila observatory
observatory matejkosiarcik.com --zero --rescan --format report
observatory matejkosiarcik.com --format report --min-grade B+ --min-score 80

# webhint.io
curl -L https://matejkosiarcik.com/urllist.txt | xargs -n1 hint

printf '\n'

if [ "$(curl -Iso /dev/null -w "%{http_code}" https://matejkosiarcik.com/this_page_should_not_exist_for_real_omg_it_is_looong)" != 404 ]; then
    printf 'Non existent pages should return 404 status\n'
    exit 1
fi

if [ "$(curl -Iso /dev/null -w "%{http_code}" https://matejkosiarcik.com/404/)" != 404 ]; then
    printf '/404 page should also return status 404\n'
    exit 1
fi

# Check redirects for trailing "/"
# tmpfile="$(mktemp)"
# curl -Iso "${tmpfile}" https://matejkosiarcik.com/blog
# status="$(head -n1 <"${tmpfile}" | cut -d' ' -f2 | tr -d [:space:])"
# location="$(grep -iE '^location:' <"${tmpfile}" | cut -d' ' -f2 | tr -d [:space:])"
# rm -f "${tmpfile}"
# if [ "${status}" != 301 ] || [ "${location}" != '/blog/' ]; then
#     printf 'Misconfigured redirects\n'
#     printf 'From /blog\n'
#     printf 'Expected location /blog/ (got %q)\n' "${location}"
#     printf 'Expected status 301 (got %s)\n' "${status}"
#     exit 1
# fi
