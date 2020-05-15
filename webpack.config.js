const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const output_path = path.resolve(__dirname, "dist/js");

module.exports = {
    entry: "./src/js/index.js",
    mode: "development",
    optimization: {
        usedExports: true
    },
    output: {
        filename: "timeline.js",
        path: output_path,
        library: "TL" // https://webpack.js.org/configuration/output/#outputlibrary
    },
    devServer: {
        contentBase: './dist',
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
        new CleanWebpackPlugin({ 
            // cleanStaleWebpackAssets: false 
        }),        
    ],
};
