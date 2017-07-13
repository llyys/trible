const path = require("path");
module.exports = (isDebug) => {
  return [
    {
      loader: "css-loader-module-json",
      options: {
        buildPath: path.resolve(__dirname, "build"),
        srcPath: path.resolve(__dirname, "src")
      }
    },
    {
      loader: "css-loader",
      options: {
        minimize: !isDebug,
        sourceMap: true,
        importLoaders: 1,
        modules: true, // CSS Modules https://github.com/css-modules/css-modules
        localIdentName: "[local]-[hash:base64:5]"
      }
    },
    // {
    //   loader: "postcss-loader",
    //   options: {
    //     plugins: loader => [
    //       require("autoprefixer")({
    //         browsers: ["last 2 versions", "ie >= 9"]
    //       }) //,
    //       //require('postcss-global-import')
    //     ],
    //     sourceMap: true
    //   }
    // },
    {
      loader: "sass-loader",
      options: {
        sourceMap: true
      }
    }
  ]
};
