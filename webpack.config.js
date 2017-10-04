var webpack = require('webpack'),
    path = require('path');

module.exports = {
  entry: "./source/js/main.js",
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "bundle.js",
    publicPath: "/dist"
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '../assets/'
          }
        }
      },
      {
        test: /\.(ttf|eot|svg|woff)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '../css/icons/'
          }
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'file-loader?[name].[ext]!html-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '../'
          }
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.json$/,
        use: {
          loader: 'file-loader?[name].[ext]!json-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '../js/locale/'
          }
        }
      }
    ]
  }
}
