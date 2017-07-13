const webpack = require("webpack");
const webpackConfig = require("../webpack.config");

const task = require('./lib/task');
module.exports = task('build-client', () => {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }
      console.info(stats.toString(webpackConfig.stats));
      return resolve();
    });
  });
});
