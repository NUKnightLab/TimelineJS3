var webpack = require('webpack'),
    path = require('path'),

    componentPath = path.resolve('./src/js');

module.exports = {
  context: path.join(__dirname), 
  entry: [
    "./src/js/app.js"
  ],
  output: {
    path: path.join(__dirname, "./dist/js"),
    filename: "[name].js"
  },
  resolve: {
    root: componentPath
  },
  resolveLoader: {
    root: path.join(__dirname, "node_modules")
  }
}
