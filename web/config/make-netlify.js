#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const assert = require('assert')

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
})

const htmlDirectories = glob.sync('**/index.html', { cwd: 'public' })
    .map(file => path.dirname(file))
    .filter(dir => dir !== '.')
    .map(dir => `/${dir}/`)

const reportTo = '{"group":"default","max_age":31536000,"endpoints":[{"url":"https://matejkosiarcik.report-uri.com/a/d/g"}],"include_subdomains":true}'

makeHeaders(['/', '/*.html'].concat(htmlDirectories), {
    'Link': [
        '<https://api2.matejkosiarcik.com>; rel="dns-prefetch"',
        // '<https://cdn.matejkosiarcik.com>; rel="dns-prefetch"',
        // '<https://cdn.matejkosiarcik.com/style.css>; rel="preload"; as="style"; crossorigin="anonymous"',
        // '<https://cdn.matejkosiarcik.com/bundle.js>; rel="preload"; as="script"; crossorigin="anonymous"',
    ].join(', '),

    'Report-To': reportTo,
    'NEL': '{"report_to":"default","max_age":31536000,"include_subdomains":true}',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-XSS-Protection': '1; mode=block',
    'X-UA-Compatible': 'IE=edge',
    'Content-Type': 'text/html; charset=UTF-8',

    'Content-Security-Policy': [
        "default-src 'none'",
        "base-uri 'self'",
        "script-src 'self' https://*.matejkosiarcik.com https://polyfill.io",
        "style-src 'self' https://*.matejkosiarcik.com",
        "img-src 'self' https://*.matejkosiarcik.com",
        "media-src 'self' https://*.matejkosiarcik.com",
        "connect-src 'self' https://*.matejkosiarcik.com",
        "object-src 'none'",
        "form-action 'none'",
        "frame-src 'none'",
        "frame-ancestors 'none'",
        "block-all-mixed-content",
        // "require-sri-for script style",
        // "report-uri https://matejkosiarcik.report-uri.com/r/d/csp/enforce",
        "report-to default",
    ].join('; '),

    // disable all
    'Feature-Policy': [
        // 'accelerometer',
        // 'ambient-light-sensor',
        'autoplay',
        // 'battery',
        'camera',
        // 'display-capture',
        // 'document-domain',
        'encrypted-media',
        'fullscreen',
        'geolocation',
        // 'gyroscope',
        // 'layout-animations',
        // 'legacy-image-formats',
        // 'magnetometer',
        'microphone',
        'midi',
        'payment',
        // 'picture-in-picture',
        // 'publickey-credentials-get',
        // 'screen-wake-lock',
        // 'sync-xhr',
        // 'usb',
        // 'vibrate',
        // 'wake-lock',
        // 'web-share',
        // 'xr-spatial-tracking',
    ].map(el => `${el} 'none'`).join('; '),
})

makeHeaders('/*.svg', {
    'Content-Type': 'image/svg+xml; charset=UTF-8',
    'Content-Security-Policy': [
        "default-src 'none'",
        "style-src 'unsafe-inline'",
    ].join('; '),
})

makeHeaders('/*.css', {
    'Content-Type': 'text/css; charset=UTF-8',
})

makeHeaders('/*.js', {
    'Content-Type': 'text/javascript; charset=UTF-8',
    'Content-Security-Policy': [
        "default-src 'none'",
        "connect-src https://api.matejkosiarcik.com https://api2.matejkosiarcik.com",
    ].join('; '),
})
