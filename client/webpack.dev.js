const helpers = require('./webpack.helpers')
const webpackConfig = require('./webpack.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const env = {
    ENV: '"development"',
    NODE_ENV: '"development"',
    DEBUG_MODE: true,
    API_KEY: '"XXXX-XXXXX-XXXX-XXXX"'
  };

webpackConfig.module.rules = [...webpackConfig.module.rules,
  {
    test: /\.scss$/,
    use: [{
      loader: 'style-loader'
    },
    {
      loader: 'css-loader'
    },
    {
      loader: 'sass-loader'
    }
    ]
  },
  {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader'
  }
]

webpackConfig.plugins = [...webpackConfig.plugins,
  new HtmlWebpackPlugin({
    inject: true,
    filename : "app.html",
    template: helpers.root('/client/src/index.html'),
    favicon: helpers.root('/client/src/favicon.ico')
  }),
  new DefinePlugin({
    'process.env': env
  })
]

module.exports = webpackConfig