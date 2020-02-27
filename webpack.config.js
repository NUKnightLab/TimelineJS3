const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const output_path = path.resolve(__dirname, "dist");

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    optimization: {
        usedExports: true
    },
    output: {
        filename: "timeline.js",
        path: output_path,
        library: "TL" // https://webpack.js.org/configuration/output/#outputlibrary
    },
    plugins: [new CopyPlugin([{ 
        from: "./src/language/locale/*.json",
        to: path.resolve(output_path, "locale"),
        flatten: true
    }])]
};
