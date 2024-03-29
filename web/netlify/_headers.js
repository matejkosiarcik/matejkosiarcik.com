#!/usr/bin/env node
const path = require('path');
const glob = require('glob');
const assert = require('assert');
const fs = require('fs');

const outputFile = path.join('public', '_headers');

/**
 * Output headers for each url
 */
function makeHeaders(_urls, headers) {
  assert(Array.isArray(_urls) || typeof _urls === 'string');
  const urls = Array.isArray(_urls) ? _urls : [_urls];

  const outputHeaders = Object.keys(headers).map((key) => {
    assert(typeof key === 'string');
    assert(typeof headers[key] === 'string');
    return `    ${key}: ${headers[key]}`;
  }).join('\n');
  const output = urls.map((url) => `${url}\n${outputHeaders}\n`).join('');
  fs.appendFileSync(outputFile, output);
}

makeHeaders('/*', {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Permitted-Cross-Domain-Policies': 'none',

  // By default cache nothing (such as robots.txt or 404s)
  // We later override this setting for appropriate files (pages, assets, etc.)
  'Cache-Control': 'private, no-store, no-cache',

  // Can't be same-origin, because assets will be served from subdomain (eventually)
  // Can't be cross-origin, because I guess hotlinking ¯\_(ツ)_/¯
  'Cross-Origin-Resource-Policy': 'same-site',
});

const htmlDirectories = glob.sync('**/index.html', { cwd: 'public' })
  .map((file) => path.dirname(file))
  .filter((dir) => dir !== '.')
  .map((dir) => `/${dir}/`);

// This is for Permissions-Policy (and deprecate Feature-Policy)
// I don't understand why it doesn't have a "default" clause (like csp)
const disabledPermissions = [
  'interest-cohort', // Google's FLOC
  'accelerometer',
  // 'ambient-light-sensor', // warning in chrome
  'autoplay',
  // 'battery', // warning in chrome
  'camera',
  // 'display-capture', // warning in chrome
  // 'document-domain',
  // 'document-write',
  // 'encrypted-media',
  // 'execution-while-not-rendered',
  // 'execution-while-out-of-viewport',
  'fullscreen',
  'geolocation',
  'gyroscope',
  // 'layout-animations',
  'magnetometer',
  'microphone',
  // 'midi',
  // 'navigation-override', // warning in chrome
  // 'payment',
  // 'picture-in-picture',
  // 'publickey-credentials',
  // 'publickey-credentials-get',
  // 'screen-wake-lock',
  'sync-xhr',
  'usb',
  // 'vibrate', // warning in chrome
  // 'vr',
  // 'wake-lock', // warning in chrome
  // 'webauthn',
  // 'web-share',
  // 'xr-spatial-tracking',
].map((el) => `${el}=()`).join(', ');

makeHeaders(['/', '/*.html'].concat(htmlDirectories), {
  // 'Link': [
  //     // '<https://cdn.matejkosiarcik.com>; rel='dns-prefetch'',
  // ].join(', '),

  'Report-To': "{'group':'default','max_age':31536000,'endpoints':[{'url':'https://matejkosiarcik.report-uri.com/a/d/g'}],'include_subdomains':true}",
  NEL: "{'report_to':'default','max_age':31536000,'include_subdomains':true}",
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'X-UA-Compatible': 'IE=edge',
  'Content-Type': 'text/html; charset=UTF-8',

  'Content-Security-Policy': [
    "default-src 'none'",
    "base-uri 'self'",
    "script-src 'self' https://*.matejkosiarcik.com",
    "style-src 'self' https://*.matejkosiarcik.com",
    "img-src 'self' https://*.matejkosiarcik.com https://matejkosiarcik.goatcounter.com",
    "connect-src 'self' https://*.matejkosiarcik.com",
    "form-action 'none'",
    "frame-ancestors 'none'",
    'block-all-mixed-content',
    // 'report-uri https://matejkosiarcik.report-uri.com/r/d/csp/enforce',
    // 'report-to default',
  ].join('; '),

  'Permissions-Policy': disabledPermissions,
  'Expect-CT': "max-age=0, enforce, report-uri='https://matejkosiarcik.report-uri.com/r/d/ct/enforce'",
  'Cache-Control': 'max-age=600, must-revalidate',

  'Cross-Origin-Embedder-Policy': "unsafe-none; report-to='default'", // TODO: switch to "require-corp" after all used external resources implemented "Cross-Origin-Resource-Policy: cross-origin" (goatcounter is currently missing support for this)
  'Cross-Origin-Opener-Policy': "same-origin; report-to='default'",
});

makeHeaders('/*.svg', {
  'Content-Type': 'image/svg+xml; charset=UTF-8',
  'Content-Security-Policy': [
    "default-src 'none'",
    "style-src 'unsafe-inline'",
  ].join('; '),
});

makeHeaders(['/*.jpg', '/*.jpeg', '/*.png', '/*.apng', '/*.gif', '/*.ico', '/*.svg', '/*.webp', '/*.avif', '/*.heif', '/*.heic', '/*.bmp'], {
  'Cache-Control': 'max-age=86400',
});

makeHeaders('/*.css', {
  'Content-Type': 'text/css; charset=UTF-8',
  'Cache-Control': 'max-age=31536000, immutable',
});

makeHeaders('/*.js', {
  'Content-Type': 'application/javascript; charset=UTF-8',
  'Cache-Control': 'max-age=31536000, immutable',
});

makeHeaders('/*.xml', {
  'Content-Type': 'application/xml; charset=UTF-8',
});

makeHeaders('/*.json', {
  'Content-Type': 'application/json; charset=UTF-8',
});

makeHeaders('/*.txt', {
  'Content-Type': 'text/plain; charset=UTF-8',
});
