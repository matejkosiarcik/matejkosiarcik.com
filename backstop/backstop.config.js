const url = 'https://matejkosiarcik.com'

module.exports = {
  "id": "backstop_default",
  "viewports": [
    {
      "label": "phone-small",
      "width": 320,
      "height": 480
    },
    {
      "label": "phone",
      "width": 375,
      "height": 667
    },
    {
      "label": "tablet",
      "width": 768,
      "height": 1024
    },
    {
      "label": "hd",
      "width": 1280,
      "height": 720
    },
    {
      "label": "fhd",
      "width": 1920,
      "height": 1080
    },
    {
      "label": "4k",
      "width": 3840,
      "height": 2160
    }
  ],
  "onBeforeScript": "puppet/onBefore.js",
  "onReadyScript": "puppet/onReady.js",
  "scenarios": [
    {
      "label": "home",
      "url": `${url}`,
      "misMatchThreshold" : 0.1,
    }
  ],
  "paths": {
    "bitmaps_reference": "backstop_data/bitmaps_reference",
    "bitmaps_test": "backstop_data/bitmaps_test",
    "engine_scripts": "backstop_data/engine_scripts",
    "html_report": "backstop_data/html_report",
    "ci_report": "backstop_data/ci_report"
  },
  "report": ["browser"],
  "engine": "puppeteer",
  "engineOptions": {
    "args": ["--no-sandbox"]
  },
  "asyncCaptureLimit": 5,
  "asyncCompareLimit": 50,
  "debug": false,
  "debugWindow": false
}
