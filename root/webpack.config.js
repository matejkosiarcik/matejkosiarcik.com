const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

let plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'markup/index.handlebars',
        inject: true,
        // excludeAssets: [/style.*\.js$/],
        templateParameters: {
            content: 'Home!!!',
            title: 'Matej Košiarčik - Software developer',
        },
    }),
    new HtmlWebpackPlugin({
        filename: '404.html',
        template: 'markup/404.handlebars',
        inject: true,
        // excludeAssets: [/style.*\.js$/],
        templateParameters: {
            content: '404',
            title: 'Matej Košiarčik - Software developer',
        },
    }),
    // new HtmlWebpackExcludeAssetsPlugin(),
    new MiniCssExtractPlugin({
        filename: '[name].css',
    }),
]

if (mode === 'development') {
    plugins = plugins.concat(new webpack.HotModuleReplacementPlugin())
}

const cssLoaders = mode === 'production' ? [
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: '/',
            hmr: mode === 'development',
        },
    },
    {
        loader: 'css-loader',
        options: {
            url: false,
            import: false,
        }
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
            injectType: 'inline',
        },
        'postcss-loader',
    ]

const config = {
    mode: mode,
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'public'),
        publicPath: '/',
    },
    entry: {
        bundle: path.join(__dirname, 'script', 'bundle.ts'),
        style: path.join(__dirname, 'style', 'style.css'),
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: cssLoaders,
                [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            import: false,
                        },
                        injectType: 'inline',
                    },
                    'postcss-loader',
                ]
                // [
                // {
                //     loader: MiniCssExtractPlugin.loader,
                //     options: {
                //         publicPath: '/',
                //         hmr: mode === 'development',
                //     },
                // },
                // {
                //     loader: 'css-loader',
                //     options: {
                //         url: false,
                //         import: false,
                //     }
                // },
                // 'postcss-loader',
                // ],
            },
            {
                test: /\.handlebars$/,
                loader: 'handlebars-loader'
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.wasm', '.json']
    },
    plugins: plugins,
    watch: mode === 'development',
}

if (mode === 'development') {
    config.devServer = {
        hot: true,
        publicPath: '/',
        inline: true,
        liveReload: true,
        progress: true,
        contentBase: 'markup',
        watchContentBase: true,
    }
}

module.exports = config;
