const webpack = require("webpack");
const webpackConfig = require("../webpack.config");
const tscBuilder = require("./lib/tsc-builder");
const path = require('path');
var cpx = require("cpx");

const task = require('./lib/task');
module.exports = task('build-server', () => {
  let rootDir = path.resolve(__dirname, '../');
  let p = path.resolve(__dirname, '../tsconfig.json');
  console.log(`tsc --config=${p}`);
  return tscBuilder(p).then(() => {
    let src = path.resolve(rootDir, './src') + '/**/*.json';
    console.log('src ' + src);
    let dest = path.resolve(rootDir, './build');
    return copy(src, dest);
  });
});

function copy(source, dest){
  return new Promise((resolve, reject) => {
    cpx.copy(source, dest, () => {
      resolve();
    });
  });
}
