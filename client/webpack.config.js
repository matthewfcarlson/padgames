
var path = require('path')
var webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const output_dir = path.resolve(__dirname, '../dist_client')
const src_dir = path.resolve(__dirname, './src')
const public_src_dir = path.resolve(__dirname, "./public")
const public_out_dir = path.join(output_dir, "public")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

module.exports = {
  entry: path.join(src_dir, '/index.ts'),
  output: {
    path: output_dir,
    publicPath: "/",
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: ['/client/src/index.html']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json', '.html'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new NamedModulesPlugin(),
    new CopyWebpackPlugin([{
        from: public_src_dir,
        to: public_out_dir
      } ]),
    new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: output_dir,
        // Required - Routes to render.
        routes: [ '/', '/about'],
    })
  ]
}