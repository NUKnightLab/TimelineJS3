const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge.smart({
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: ['./src/template', './src/css'],
        contentBasePublicPath: ['/', '/css'],
        stats: 'verbose',
        openPage: "/index.html",
        disableHostCheck: true
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