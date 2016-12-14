var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require("path");

module.exports = {
  entry: {
    app: "./src",
    vendor: []
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: '[chunkhash].[name].js'
  },
  devServer: {
    historyApiFallback: {
      index: 'index.html'
    },
    outputPath: path.resolve(__dirname, "build"),
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass")
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css?modules=true")
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file',
        query: {
          name: 'assets/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".scss"],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "public"),
        to: path.resolve(__dirname, "build"),
      }
    ], {
      ignore: [
        '*.ejs'
      ],
    }),
    new CleanWebpackPlugin(['build']),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'] // Specify the common bundle's name.
    }),
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      template: './public/index.ejs',
      chunksSortMode: function(entry1, entry2) {
        var index1 = ['manifest', 'vendor', 'app'].indexOf(entry1.names[0]);
        var index2 = ['manifest', 'vendor', 'app'].indexOf(entry2.names[0]);
        if (index2 == -1 || index1 < index2) {
          return -1;
        }
        if (index1 == -1 || index1 > index2) {
          return 1;
        }
        return 0;
      },
    })
  ],
};
