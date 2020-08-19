let baseURL = 'https://matejkosiarcik.com'

module.exports = {
    "id": "backstop_default",
    "viewports": [
        {
            "label": "phone",
            "width": 375,
            "height": 667
        },
        {
            "label": "fullhd",
            "width": 1024,
            "height": 768
        },
        {
            "label": "fullhd",
            "width": 1920,
            "height": 1080
        },
    ],
    "onBeforeScript": "puppet/onBefore.js",
    "onReadyScript": "puppet/onReady.js",
    "scenarios": [
        {
            "label": "home",
            "url": `${baseURL}`
        },
        {
            "label": "404",
            "url": `${baseURL}/404`
        },
    ],
    "paths": {
        "bitmaps_reference": "backstop_data/bitmaps_reference",
        "bitmaps_test": "backstop_data/bitmaps_test",
        "engine_scripts": "backstop_data/engine_scripts",
        "html_report": "backstop_data/html_report",
        "ci_report": "backstop_data/ci_report"
    },
    "report": [
        "CLI",
        "browser",
    ],
    "ci": {
        "format": "browser"
    },
    "engine": "puppeteer",
    "engineOptions": {
        "args": [
            "--no-sandbox"
        ]
    },
    "asyncCaptureLimit": 5,
    "asyncCompareLimit": 50,
    "debug": false,
    "debugWindow": false
}
