#!/usr/bin/env node
const fs = require('fs')
const { assert } = require('console')
const path = require('path')
const glob = require('glob')

fs.copyFileSync(path.join('config', '_redirects'), path.join('public', '_redirects'))
fs.writeFileSync(path.join('public', '_headers'), '')

function makeHeaders(urls, headers) {
    if (typeof urls === 'string') {
        urls = [urls]
    }
    assert(Array.isArray(urls))

    let outHeaders = []
    for (let header in headers) {
        assert(typeof header === 'string')
        assert(typeof headers[header] === 'string')
        outHeaders.push(`  ${header}: ${headers[header]}`)
    }
    let outHeader = outHeaders.map(header => `  ${header}`).join('\n')
    for (let url of urls) {
        const output = `${url}\n${outHeader}\n`
        fs.appendFileSync(path.join('public', '_headers'), output)
    }
}

makeHeaders('/*', {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': "default-src 'none'",
})

const htmlDirectories = glob.sync('**/index.html', { cwd: 'public' })
    .map(file => path.dirname(file))
    .filter(dir => dir !== '.')
    .map(dir => `/${dir}/`)

makeHeaders(['/', '/*.html'].concat(htmlDirectories), {
    'Link': [
        '</style.css>; rel="preload"; as="style"',
        '</bundle.js>; rel="preload"; as="script"',
    ].join(', '), // TODO: replace asset URLs to point at cdn

    'Report-To': '{"group":"default","max_age":31536000,"endpoints":[{"url":"https://matejkosiarcik.report-uri.com/a/d/g"}],"include_subdomains":true}',
    'NEL': '{"report_to":"default","max_age":31536000,"include_subdomains":true}',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Clear-Site-Data': '"*"',
    'X-Permitted-Cross-Domain-Policies': 'none',

    'Content-Security-Policy': [
        "default-src 'none'",
        "base-uri 'self'",
        "script-src 'self' 'unsafe-inline' https://*.matejkosiarcik.com https://polyfill.io",
        "style-src 'self' 'unsafe-inline' https://*.matejkosiarcik.com",
        "img-src 'self' https://*.matejkosiarcik.com",
        "media-src 'self' https://*.matejkosiarcik.com",
        "connect-src 'self' https://*.matejkosiarcik.com",
        "block-all-mixed-content",
        "require-sri-for script style",
        "report-uri https://matejkosiarcik.report-uri.com/r/d/csp/enforce",
        "report-to default",
    ].join('; '),

    // disable all
    'Feature-Policy': [
        'accelerometer',
        'ambient-light-sensor',
        'autoplay',
        'camera',
        'encrypted-media',
        'fullscreen',
        'geolocation',
        'gyroscope',
        'magnetometer',
        'microphone',
        'midi',
        'payment',
        'picture-in-picture',
        'speaker',
        'sync-xhr',
        'usb',
        'vibrate',
        'vr',
    ].map(el => `${el} 'none'`).join('; '),
})

makeHeaders('/*.svg', {
    'Content-Type': 'image/svg+xml; charset=UTF-8',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
})
