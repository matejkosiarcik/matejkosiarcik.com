const color = require('css-color-converter')
const convert = require('color-convert')

function numberToHexDigit(number) {
    const hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'] // this is stupid, but whatever
    return hexDigits[Math.floor(number)]
}

Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max)
}

const plugins = [
    require('postcss-easy-import')({
        extensions: ['.css', '.scss'],
        prefix: '_',
    }),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-custom-properties')({
        preserve: true,
    }),
    require('postcss-hexrgba'),
    require('postcss-functions')({
        functions: {
            darken: (value, delta) => {
                const fraction = delta.includes('%') ? parseFloat(delta) : parseFloat(delta) * 100
                const oldRgba = color.fromString(value).toRgbaArray()
                const oldHsl = convert.rgb.hsl([oldRgba[0], oldRgba[1], oldRgba[2]])
                const lightness = (parseFloat(oldHsl[2]) - fraction).clamp(0, 100)
                const newRgb = convert.hsl.rgb([oldHsl[0], oldHsl[1], lightness])
                const hexString = `#${convert.rgb.hex(newRgb)}`
                return oldRgba[3] === 1 ? hexString : `${hexString}${numberToHexDigit(oldRgba[3] / 16)}${numberToHexDigit(oldRgba[3] % 16)}`
            },
            lighten: (value, delta) => {
                const fraction = delta.includes('%') ? parseFloat(delta) : parseFloat(delta) * 100
                const oldRgba = color.fromString(value).toRgbaArray()
                const oldHsl = convert.rgb.hsl([oldRgba[0], oldRgba[1], oldRgba[2]])
                const lightness = (parseFloat(oldHsl[2]) + fraction).clamp(0, 100)
                const newRgb = convert.hsl.rgb([oldHsl[0], oldHsl[1], lightness])
                const hexString = `#${convert.rgb.hex(newRgb)}`
                return oldRgba[3] === 1 ? hexString : `${hexString}${numberToHexDigit(oldRgba[3] / 16)}${numberToHexDigit(oldRgba[3] % 16)}`
            },
        },
    }),
    require('postcss-extend-rule'),
    require('postcss-calc'),
    require('postcss-preset-env')({
        preserve: false,
        autoprefixer: false,
        features: {
            'custom-properties': false, // instead using css-variables
            'css-prefers-color-scheme': false, // do not translate dark mode
        },
    }),
    require('postcss-custom-media')({
        preserve: false,
    }),
    require('postcss-media-minmax'),
    require('autoprefixer'),
]

module.exports = {
    parser: 'postcss-scss',
    plugins: plugins,
}
