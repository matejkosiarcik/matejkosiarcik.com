const path = require('path')
const process = require('process')
const glob = require('glob')
const glob2 = require('glob-all')

const webpack = require('webpack')

const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const CopyPlugin = require('copy-webpack-plugin')
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries")

const ScriptExtPlugin = require('script-ext-html-webpack-plugin')

const TerserPlugin = require('terser-webpack-plugin')
const ShakePlugin = require('webpack-common-shake').Plugin
const PurgecssPlugin = require('purgecss-webpack-plugin')

process.env.NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const outputDir = 'public'

// TODO: try google-closure-compiler or YUI compressor

// search all jekyll generated html pages
const htmlDir = 'jekyll/_site' // always want "/" slash for globs
const plugins = glob.sync(`${htmlDir}/**/*.html`, { nodir: true }).map(file => new HtmlPlugin({
    filename: file.replace(/.*_site[\\/]/, ''),
    template: file,
    inject: process.env.NODE_ENV === 'development',
    minify: process.env.NODE_ENV === 'development' ? false : {
        useShortDoctype: true,
        collapseWhitespace: true,
        removeComments: true,
        processConditionalComments: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeScriptTypeAttributes: true,
        minifyCSS: true,
        // minifyJS: true, // Wrongly processes quotes
        minifyURLs: true,
    },
})).concat([
    new CopyPlugin({
        patterns:
            [].concat(
                glob.sync('../images/favicon/{,artifacts/}*.{svg,png,ico}').map(file => { return { from: file, to: '' } }),
                glob.sync('../images/docker/artifacts/*.{jpg,png,svg,bmp,gif,webp}').map(file => { return { from: file, to: 'img' } }),
                glob.sync('../images/icons/{,artifacts/}*.{jpg,png,svg,bmp,gif,webp}').map(file => { return { from: file, to: 'img' } }),
                [
                    { from: path.join(__dirname, 'jekyll', '_site', 'sitemap.xml'), to: '' },
                    { from: path.join(__dirname, 'config', 'netlify.toml'), to: '' },
                    { from: path.join(__dirname, 'config', 'robots.txt'), to: '' },
                ],
            ),
    }),
])

if (process.env.NODE_ENV === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin())
}

if (process.env.NODE_ENV === 'production') {
    plugins.push(
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new ScriptExtPlugin({
            defaultAttribute: 'defer',
        }),
        new ShakePlugin(),
        new PurgecssPlugin({
            paths: glob2.sync([
                `${htmlDir}/**/*.html`,
                './script/**/*.{ts,js}',
            ], { nodir: true }),
        }),
    )
}

const cssLoaders = process.env.NODE_ENV === 'production' ?
    [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '/',
                hmr: process.env.NODE_ENV === 'development',
            },
        },
        {
            loader: 'css-loader',
            options: {
                url: false,
                import: false,
            },
        },
        'postcss-loader',
    ] : [
        'style-loader',
        {
            loader: 'css-loader',
            options: {
                url: false,
                import: false,
            },
        },
        'postcss-loader',
    ]

const config = {
    mode: process.env.NODE_ENV,
    output: {
        filename: '[name].js',
        path: path.join(__dirname, outputDir),
        publicPath: '/',
        crossOriginLoading: 'anonymous',
    },
    entry: {
        bundle: path.join(__dirname, 'script', 'main.ts'),
        style: path.join(__dirname, 'style', 'main.scss'),
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attributes: false,
                            minimize: false,
                        },
                    },
                    {
                        loader: 'posthtml-loader',
                    },
                ],
            },
            {
                test: /\.ts$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: cssLoaders,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.wasm', '.json'],
    },
    plugins: plugins,
    optimization: {
        minimize: process.env.NODE_ENV === 'production',
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                        keep_quoted_props: false,
                    },
                    compress: {
                        passes: 20,
                        arguments: true,
                        keep_fargs: false,
                    },
                    keep_classnames: false,
                    keep_fnames: false,
                    toplevel: true,
                    ie8: true,
                    safari10: true,
                },
                extractComments: false,
            }),
        ],
    },
    watch: process.env.NODE_ENV === 'development',
}

if (process.env.NODE_ENV === 'development') {
    config.devServer = {
        hot: true,
        publicPath: config.output.publicPath,
        inline: true,
        liveReload: true,
        progress: false,
        watchContentBase: true,
    }
}

module.exports = config
