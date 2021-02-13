#!/usr/bin/env node
const path = require('path')
const glob = require('glob')
const assert = require('assert')

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
        console.log(output)
    }
}

makeHeaders('/*', {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-Permitted-Cross-Domain-Policies': 'none',

    // by default cache nothing (such as robots.txt or 404s)
    // override this setting for appropriate files (pages, assets, etc.)
    'Cache-Control': 'private, no-store, no-cache',
})

const htmlDirectories = glob.sync('**/index.html', { cwd: 'public' })
    .map(file => path.dirname(file))
    .filter(dir => dir !== '.')
    .map(dir => `/${dir}/`)

// This is for Permissions-Policy (and deprecate Feature-Policy)
// I don't understand why it doesn't have a "default" clause (like csp)
const permissions = [
    // 'accelerometer',
    // 'ambient-light-sensor',
    // 'autoplay',
    // 'battery',
    // 'camera',
    // 'display-capture',
    // // 'document-domain',
    // 'document-write',
    // // 'encrypted-media',
    // // 'execution-while-not-rendered',
    // // 'execution-while-out-of-viewport',
    // 'fullscreen',
    // 'geolocation',
    // 'gyroscope',
    // // 'layout-animations',
    // // 'legacy-image-formats',
    // 'magnetometer',
    // 'microphone',
    // 'midi',
    // 'navigation-override',
    // // 'oversized-images',
    // 'payment',
    // // 'picture-in-picture',
    // // 'publickey-credentials-get',
    // // 'screen-wake-lock',
    // 'sync-xhr',
    // 'usb',
    // // 'vibrate',
    // // 'vr',
    // // 'wake-lock',
    // // 'webauthn',
    // // 'web-share',
    // // 'xr-spatial-tracking',
]

makeHeaders(['/', '/*.html'].concat(htmlDirectories), {
    // 'Link': [
    //     // '<https://api.matejkosiarcik.com>; rel="dns-prefetch"',
    //     // '<https://cdn.matejkosiarcik.com>; rel="dns-prefetch"',
    //     // '<https://cdn.matejkosiarcik.com/style.css>; rel="preload"; as="style"; crossorigin="anonymous"',
    //     // '<https://cdn.matejkosiarcik.com/bundle.js>; rel="preload"; as="script"; crossorigin="anonymous"',
    // ].join(', '),

    'Report-To': '{"group":"default","max_age":31536000,"endpoints":[{"url":"https://matejkosiarcik.report-uri.com/a/d/g"}],"include_subdomains":true}',
    'NEL': '{"report_to":"default","max_age":31536000,"include_subdomains":true}',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'X-UA-Compatible': 'IE=edge',
    'Content-Type': 'text/html; charset=UTF-8',

    'Content-Security-Policy': [
        "default-src 'none'",
        "base-uri 'self'",
        "script-src 'self' https://*.matejkosiarcik.com https://polyfill.io",
        "style-src 'self' https://*.matejkosiarcik.com",
        "img-src 'self' https://*.matejkosiarcik.com https://matejkosiarcik.goatcounter.com",
        "connect-src 'self' https://*.matejkosiarcik.com https://matejkosiarcik.goatcounter.com",
        "form-action 'none'",
        "frame-ancestors 'none'",
        "block-all-mixed-content",
        // "report-uri https://matejkosiarcik.report-uri.com/r/d/csp/enforce",
        // "report-to default",
    ].join('; '),

    // 'Feature-Policy': permissions.map(el => `${el} 'none'`).join('; '),
    'Permissions-Policy': '', // permissions.map(el => `${el}=()`).join(', '),
    'Expect-CT': 'max-age=0, report-uri="https://matejkosiarcik.report-uri.com/r/d/ct/reportOnly"',

    'Cache-Control': 'max-age=600, must-revalidate',
})

makeHeaders('/*.svg', {
    'Content-Type': 'image/svg+xml; charset=UTF-8',
    'Content-Security-Policy': [
        "default-src 'none'",
        "style-src 'unsafe-inline'",
    ].join('; '),
})

makeHeaders(['/*.jpg', '/*.jpeg', '/*.png', '/*.apng', '/*.gif', '/*.ico', '/*.svg', '/*.webp', '/*.avif', '/*.heif', '/*.heic', '/*.bmp'], {
    'Cache-Control': 'max-age=86400',
})

makeHeaders('/*.css', {
    'Content-Type': 'text/css; charset=UTF-8',
    'Cache-Control': 'max-age=31536000, immutable',
})

makeHeaders('/*.js', {
    'Content-Type': 'text/javascript; charset=UTF-8',
    'Cache-Control': 'max-age=31536000, immutable',
})
