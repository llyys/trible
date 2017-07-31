const path = require("path");
var mkdirp = require("mkdirp");
const fs = require("fs");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

const ManifestPlugin = require("webpack-manifest-plugin");

const ROOT_DIR = path.resolve(__dirname, "./");
const SRC_DIR = path.resolve(ROOT_DIR, "src");
const APP_DIR = path.resolve(SRC_DIR, "client");
const SERVER_DIR = path.resolve(SRC_DIR, "server");
const nodeModulesPath = path.resolve(__dirname, "node_modules");

const styleRule = require("./tools/webpack/rules/style-rules.js");

const dependencies = require("./package.json").dependencies;

const isDebug = !process.argv.includes("--release");
const isVerbose = process.argv.includes("--verbose");

if (isVerbose) {
  console.log("Debug mode=" + isDebug);
}

const config = {
  stats: { modules: true },
  entry: {
    vendor: Object.keys(dependencies),
    index: [
      //"react-hot-loader/patch",
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
      APP_DIR + "/client.tsx"
    ]
    //vendor: ["react", "react-dom"]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".scss", ".css"],
    alias: {
      "~": SRC_DIR
    }
  },
  resolveLoader: {
    modules: ["node_modules", "tools/webpack/loaders/"],
    extensions: [".js"]
  },
  // Choose a developer tool to enhance debugging
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: isDebug ? "cheap-module-source-map" : "source-map",

  cache: true,
  output: {
    path: path.resolve(__dirname, "./build/public/"),
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: isVerbose,
    publicPath: "/public/",
    filename: isDebug ? "[name].js" : "[name].[chunkhash:8].js",
    chunkFilename: isDebug ? "[name].chunk.js" : "[name].[chunkhash:8].chunk.js"
    // // Point sourcemap entries to original disk location
    // devtoolModuleFilenameTemplate: info =>
    //   path.resolve(info.absoluteResourcePath)
  },

  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/DemoLoader\.ts/),

    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    // https://webpack.js.org/plugins/commons-chunk-plugin/
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor"
      //minChunks: module => /node_modules/.test(module.resource)
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": isDebug ? '"development"' : '"production"',
      "process.env.BROWSER": true
    }),
    new ExtractTextPlugin("[name].css"),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    // Prevents users from importing files from outside of src/client (or node_modules/).
    // This often causes confusion because we only process files within src/ with babel.
    // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
    // please link the files into your node_modules/ and let module-resolution kick in.
    // Make sure your source files are compiled, as they will not be processed in any way.
    //new ModuleScopePlugin(APP_DIR),
    new ManifestPlugin({
      fileName: "../manifest.json"
    }),
    // ,
    // new webpack.SourceMapDevToolPlugin({
    //   filename: '[file].map', // Remove this line if you prefer inline source maps
    //   moduleFilenameTemplate: path.relative(BUILD_DIR, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
    // })

    ...(isDebug
      ? [new webpack.HotModuleReplacementPlugin()] // to generate hot update chunks
      : [
          // Decrease script evaluation time
          // https://github.com/webpack/webpack/blob/master/examples/scope-hoisting/README.md
          new webpack.optimize.ModuleConcatenationPlugin(),

          // Minimize all JavaScript output of chunks
          // https://github.com/mishoo/UglifyJS2#compressor-options
          new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
              screw_ie8: true, // React doesn't support IE8
              warnings: isVerbose,
              unused: true,
              dead_code: true
            },
            mangle: {
              screw_ie8: true
            },
            output: {
              comments: false,
              screw_ie8: true
            }
          })
        ])
  ],
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        exclude: ["/node_modules/", `${SERVER_DIR}/**`],
        use: [
          { loader: "react-hot-loader/webpack" },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              silent: true,
              configFileName: "tsconfig.client.json"
            }
          }
        ]
      },
      {
        test: /\.s?css$/,
        exclude: [/node_modules/],
        use: isDebug
          ? [{ loader: "style-loader" }, ...styleRule(isDebug)]
          : {
              fallback: "style-loader",
              publicPath: "/dist",
              use: ExtractTextPlugin.extract(styleRule(isDebug))
            }
      }
    ]
  },

  stats: {
    cached: isVerbose,
    cachedAssets: isVerbose,
    chunks: isVerbose,
    chunkModules: isVerbose,
    colors: true,
    hash: isVerbose,
    modules: isVerbose,
    reasons: isDebug,
    timings: true,
    version: isVerbose
  },
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.js.org/configuration/node/
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  }
};

module.exports = config;
