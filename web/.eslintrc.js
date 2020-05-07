module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 0,
        'comma-dangle': ['error', 'always-multiline'],
        'eqeqeq': ['error', 'always'],
        'semi': ['error', 'never', { 'beforeStatementContinuationChars': 'never' }],
    }
}
