var webpack = require('webpack'),
    path = require('path');

module.exports = {
  context: path.join(__dirname, 'source'),
  entry: {
    "main": "./js/main.js",
    "timeline": "./js/TL.Timeline.js",
    "timeline-embed-cdn": "./js/embed/Embed.CDN.js",
    "timeline-embed": "./js/embed/Embed.js",
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
    libraryTarget: "var",
    library: "[name]",
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
        test: /\.html$/,
        use: {
          loader: 'file-loader?name=[path][name].[ext]!html-loader',
          options: {
            name: '[path][name].[ext]',
            outputPath: '../',
          }
        }
      },
      {
        test: /\.(less|css)$/,
        use: [{
          loader: "style-loader",
        }, {
          loader: "file-loader?[name].[ext]!css-loader",
          options: {
            name: '[path][name].css',
            context: path.join(__dirname, 'source/less'),
            outputPath: '../css/'
          }
        }, {
          loader: "less-loader",
        }]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader?cacheDirectory=true',
        }
      },
      {
        test: /\.json$/,
        use: {
          loader: 'file-loader?[name].[ext]!json-loader',
          options: {
            name: '[path][name].[ext]',
            context: path.join(__dirname, 'source/'),
            outputPath: '../'
          }
        }
      }
    ]
  }
}
