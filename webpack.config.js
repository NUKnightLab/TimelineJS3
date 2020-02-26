const path = require("path");

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    optimization: {
        usedExports: true
    },
    output: {
        filename: "timeline.js",
        path: path.resolve(__dirname, "dist"),
        library: "TL" // https://webpack.js.org/configuration/output/#outputlibrary
    }
};
