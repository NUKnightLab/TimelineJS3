const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = merge.smart({
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        allowedHosts: 'all',
        devMiddleware: {
            stats: 'normal'
        },
        static: [{
                directory: path.join(__dirname, "src/template"),
                publicPath: "/"
            },
            {
                directory: path.join(__dirname, "src/css"),
                publicPath: "/css"
            }
        ]
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ['style-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/template/index.html'
        })
    ]
}, common)
