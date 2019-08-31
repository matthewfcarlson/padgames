const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const autoprefixer = require('autoprefixer')
const webpackConfig = require('./webpack.config')
const helpers = require('./webpack.helpers')
const webpack = require('webpack')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const env = {
  ENV: '"production"',
  NODE_ENV: '"production"',
  DEBUG_MODE: false,
  API_KEY: '"XXXX-XXXXX-XXXX-XXXX"'
}

webpackConfig.mode = "production"

webpackConfig.module.rules = [...webpackConfig.module.rules,
{
  test: /\.scss$/,
  use: [
    {
      loader: 'style-loader'
    },
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        minimize: false,
        sourceMap: false,
        importLoaders: 2
      }
    },
    {
      loader: 'css-loader'
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [autoprefixer],
        sourceMap: false
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: false
      }
    },
    'style-loader'
  ]  
},
{
  test: /\.(jpg|png|gif)$/,
  loader: 'file-loader',
  options: {
    regExp: /(img\/.*)/,
    name: '[name].[ext]',
    publicPath: '../',
    outputPath: 'assets/img/'
  }
},
{
  test: /\.(eot|svg|ttf|woff|woff2)$/,
  loader: 'file-loader',
  options: {
    regExp: /(fonts\/.*)/,
    name: '[name].[ext]',
    publicPath: '../',
    outputPath: 'fonts/'
  }
}
]

// ensure ts lint fails the build
webpackConfig.module.rules[0].options = {
  failOnHint: true
}

//Handle chunks and uglyJS
webpackConfig.optimization = {
  splitChunks: {
    cacheGroups: {
      commons: {
        name: 'commons',
        chunks: 'initial',
        minChunks: 2
      },
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendor",
        chunks: "all"
      }
    }
  },
  minimizer: [new UglifyJsPlugin()],
}

webpackConfig.plugins = [...webpackConfig.plugins,
  
new MiniCssExtractPlugin({
  filename: 'css/[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development'
}),
new OptimizeCssAssetsPlugin({
  cssProcessor: require('cssnano'),
  cssProcessorOptions: {
    discardUnused: false,
    discardComments: { removeAll: true }
  },
  canPrint: true
}),
new HtmlWebpackPlugin({
  inject: true,
  filename: "app.html",
  template: helpers.root('/client/src/index.html'),
  favicon: helpers.root('/client/src/favicon.ico'),
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  }
}),
new CompressionPlugin({
  filename: '[path].gz[query]',
  //test: /\.js$/
}),
new webpack.DefinePlugin({
  'process.env': env
}),
new FaviconsWebpackPlugin(helpers.root('/client/src/favicon.png'))
]

module.exports = webpackConfig