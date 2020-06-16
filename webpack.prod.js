const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge.smart({
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.less$/,
            use: [MiniCssExtractPlugin.loader]
        }]
    },
    plugins: [new MiniCssExtractPlugin({
        filename: '../css/timeline.css'
    })]
}, common)