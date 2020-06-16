const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const output_path = path.resolve(__dirname, "dist/js");
module.exports = {
    entry: "./src/js/index.js",
    optimization: {
        usedExports: true
    },
    output: {
        filename: "timeline.js",
        path: output_path,
        library: "TL" // https://webpack.js.org/configuration/output/#outputlibrary
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/template/index.html'
        }),
        new CopyPlugin([{
            from: "./src/js/language/locale/*.json",
            to: path.resolve(output_path, "locale"),
            flatten: true
        }]),
        new CopyPlugin([{ // one day it would be great to build the LESS files with Webpack but it's been hard
            from: path.resolve(__dirname, 'build/css'),
            to: path.resolve(__dirname, "dist/css")
        }]),
        new CopyPlugin([{
            from: path.resolve(__dirname, 'src/template'),
            to: path.resolve(__dirname, "dist/")
        }]),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true
        }),
    ],
    module: {
        rules: [{
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
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
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '../css/icons'
                    }
                }]
            }
        ]
    }
};