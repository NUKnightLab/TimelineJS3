const path = require("path");
var glob = require("glob");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const files_to_compile = {}
glob.sync("./src/less/fonts/font.*.less").forEach((path) => {
    let fn = path.split('/').pop()
    let base = fn.replace('.less', '')
    files_to_compile[base] = path
})

const output_path = path.resolve(__dirname, "dist");
module.exports = {
    mode: 'production',
    entry: files_to_compile,
    output: {
        filename: "[name].css",
        path: path.join(output_path, 'css/fonts')
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    }
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                    }
                },
            ],
        }]
    }
};