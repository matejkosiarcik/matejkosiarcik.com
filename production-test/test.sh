#!/bin/sh
# shellcheck disable=SC2086

# link checker
blc_args='--follow --filter-level 3 --exclude https://www.linkedin.com --exclude https://linkedin.com https://matejkosiarcik.com'
blc --recursive ${blc_args}
curl -L https://matejkosiarcik.com/urllist.txt | xargs -n1 blc ${blc_args}

# mozzila observatory
observatory matejkosiarcik.com --zero --rescan --format report
observatory matejkosiarcik.com --format report --min-grade A+ --min-score 100

# webhint.io
curl -L https://matejkosiarcik.com/urllist.txt | xargs -n1 hint

printf '\n'

for page in '404' '404/' '404/index.html' '404.html' 'some-real-nonsense'; do
    if [ "$(curl -Iso /dev/null -w "%{http_code}" "https://matejkosiarcik.com/${page}")" != 404 ]; then
        printf '/%s page should return status 404\n' "${page}"
        exit 1
    fi
done

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
