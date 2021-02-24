module.exports = {
    root: true,
    ignorePatterns: [
        '**/script/tmp/**',
        '**/public/**',
        '**/backstop_data/**',
        'web/*.config.js',
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    env: {
        'es2020': true,
        'browser': true,
        'node': true,
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 0,
        'comma-dangle': ['error', 'always-multiline'],
        'eqeqeq': ['error', 'always'],
        'semi': ['error', 'always', { 'omitLastInOneLineBlock': false }],
        'no-inner-declarations': 0,
    },
}
