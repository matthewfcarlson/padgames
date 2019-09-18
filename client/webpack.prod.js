const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const autoprefixer = require("autoprefixer");
const webpackConfig = require("./webpack.config");
const helpers = require("./webpack.helpers");
const webpack = require("webpack");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const SitemapPlugin = require("sitemap-webpack-plugin").default;
const PrerenderSPAPlugin = require("prerender-spa-plugin");
var path = require("path");

const env = {
  ENV: '"production"',
  NODE_ENV: '"production"',
  DEBUG_MODE: false,
  API_KEY: '"XXXX-XXXXX-XXXX-XXXX"'
};

webpackConfig.mode = "production";

const output_dir = webpackConfig.output.path;

webpackConfig.module.rules = [
  ...webpackConfig.module.rules,
  {
    test: /\.scss$/,
    use: [
      {
        loader: "style-loader"
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
        loader: "css-loader"
      },
      {
        loader: "postcss-loader",
        options: {
          plugins: () => [autoprefixer],
          sourceMap: false
        }
      },
      {
        loader: "sass-loader",
        options: {
          sourceMap: false
        }
      },
      "style-loader"
    ]
  },
  {
    test: /\.(jpg|png|gif|svg)$/,
    use: [
      {
        loader: "file-loader",
        options: {
          regExp: /(img\/.*)/,
          name: "[name].[ext]",
          outputPath: "public/img/"
        }
      },
      {
        loader: "image-webpack-loader"
      },
    ]
  },
  {
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    loader: "file-loader",
    options: {
      regExp: /(fonts\/.*)/,
      name: "[name].[ext]",
      outputPath: "public/fonts/"
    }
  }
];

// ensure ts lint fails the build
webpackConfig.module.rules[0].options = {
  failOnHint: true
};

//Handle chunks and uglyJS
webpackConfig.optimization = {
  splitChunks: {
    cacheGroups: {
      commons: {
        name: "commons",
        chunks: "initial",
        minChunks: 2
      },
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendor",
        chunks: "all"
      }
    }
  },
  minimizer: [new UglifyJsPlugin()]
};

webpackConfig.plugins = [
  ...webpackConfig.plugins,

  new MiniCssExtractPlugin({
    filename: "css/[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
  }),
  new OptimizeCssAssetsPlugin({
    cssProcessor: require("cssnano"),
    cssProcessorOptions: {
      discardUnused: false,
      discardComments: { removeAll: true }
    },
    canPrint: true
  }),
  new HtmlWebpackPlugin({
    inject: true,
    filename: "app.html",
    template: helpers.root("/client/src/index.html"),
    favicon: helpers.root("/client/src/favicon.ico"),
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
    filename: "[path].gz[query]"
    //test: /\.js$/
  }),
  new webpack.DefinePlugin({
    "process.env": env
  }),
  new PrerenderSPAPlugin({
    // Required - The path to the webpack-outputted app to prerender.
    staticDir: output_dir,
    indexPath: path.join(output_dir, "app.html"),

    // Required - Routes to render.
    routes: ["/", "/about", "/contact", "/host", "/join"]
  }),
  new FaviconsWebpackPlugin({
    logo: helpers.root("/client/src/favicon.png"),
    prefix: 'public/',
  }),
  new SitemapPlugin(
    "https://padgames.app",
    ["/", "/about/", "/games/", "/contact", "/pricing", "/500"],
    {}
  ) //TODO figure out how to make this configurable
];

module.exports = webpackConfig;
