const presets = [
    ['@babel/env', {
        'corejs': '3',
        'loose': true,
        'useBuiltIns': 'usage',
    }],
    '@babel/typescript',
]

if (process.env.NODE_ENV === 'production') {
    presets.push(['minify', { removeDebugger: true }])
}

module.exports = {
    presets: presets,
    plugins: [
        '@babel/proposal-class-properties',
        '@babel/proposal-numeric-separator',
        '@babel/proposal-object-rest-spread',
    ],
}
