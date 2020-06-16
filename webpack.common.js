const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const output_path = path.resolve(__dirname, "dist");
module.exports = {
    entry: "./src/js/index.js",
    optimization: {
        usedExports: true
    },
    output: {
        filename: "timeline.js",
        path: path.join(output_path, 'js'),
        library: "TL" // https://webpack.js.org/configuration/output/#outputlibrary
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/template/index.html'
        }),
        new CopyPlugin([{
            from: "./src/js/language/locale/*.json",
            to: path.join(output_path, "js/locale"),
            flatten: true
        }]),
        // new CopyPlugin([{ // one day it would be great to build the LESS files with Webpack but it's been hard
        //     from: path.resolve(__dirname, 'build/css'),
        //     to: path.resolve(__dirname, "dist/css")
        // }]),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true
        }),
    ],
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