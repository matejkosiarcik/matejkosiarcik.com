#!/bin/sh
# shellcheck disable=SC2086
set -euf

# link checker
blc --recursive --follow --filter-level 3 --exclude linkedin.com --exclude twitter.com "$BASE_URL"

# mozzila observatory
# observatory matejkosiarcik.com --format report --min-grade A+ --min-score 100

# webhint.io
# curl -L "$BASE_URL/urllist.txt" | xargs -n1 hint # TODO: reenable
# curl -L "$BASE_URL/urllist.txt" | xargs -n1 is-website-vulnerable # TODO: reenable, seems to have problem with CHROME_PATH

printf '\n'

for page in '404' '404.html' 'nonexisting'; do
    if [ "$(curl -Iso /dev/null -w "%{http_code}" "$BASE_URL/$page")" != 404 ]; then
        printf '/%s page should return status 404\n' "$page"
        exit 1
    fi
done

# Check redirects for trailing "/"
# tmpfile="$(mktemp)"
# curl -Iso "$tmpfile" "$BASE_URL/blog"
# status="$(head -n1 <"$tmpfile" | cut -d' ' -f2 | tr -d [:space:])"
# location="$(grep -iE '^location:' <"$tmpfile" | cut -d' ' -f2 | tr -d [:space:])"
# rm -f "$tmpfile"
# if [ "$status" != 301 ] || [ "$location" != '/blog/' ]; then
#     printf 'Misconfigured redirects\n'
#     printf 'From /blog\n'
#     printf 'Expected location /blog/ (got %q)\n' "$location"
#     printf 'Expected status 301 (got %s)\n' "$status"
#     exit 1
# fi
