# Tests

## Local domain

To test server redirects, you need to be able to access site in form of:
`example.com`.
Add entries to your `/etc/hosts`, eg.:

```text
127.0.0.1 binarytrex.localhost
127.0.0.1 www.binarytrex.localhost
127.0.0.1 test.binarytrex.localhost
```

## MAMP usage

Remove/comment from apache's `httpd.conf` line:

```apache
Alias /favicon.ico "/Applications/MAMP/bin/favicon.ico"
```
