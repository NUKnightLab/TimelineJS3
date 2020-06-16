const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge.smart({
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: ['./src/template', './src/css'],
        contentBasePublicPath: ['/', '/css']
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ['style-loader']
        }]
    }
}, common)