module.exports = {
    "extends": [
        "stylelint-config-standard",
        "stylelint-config-recommended-scss",
        "stylelint-config-property-sort-order-smacss",
    ],
    "rules": {
        // vendor prefices before
        "at-rule-no-vendor-prefix": true,
        "media-feature-name-no-vendor-prefix": true,
        "property-no-vendor-prefix": true,
        "selector-no-vendor-prefix": true,
        "value-no-vendor-prefix": true,

        // quotes before
        "font-family-name-quotes": "always-where-recommended",
        "function-url-quotes": "always",
        "selector-attribute-quotes": "always",
        "string-quotes": "single",
    },
}
