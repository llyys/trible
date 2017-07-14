const webpack = require("webpack");
const webpackConfig = require("../webpack.config");
const tscBuilder = require("./lib/tsc-builder");
const path = require('path');
var cpx = require("cpx");
const log = console.log;
const chalk = require('chalk');

const task = require('./lib/task');
module.exports = task('build-server', () => {
  let rootDir = path.resolve(__dirname, '../');
  let p = path.resolve(__dirname, '../tsconfig.json');
  console.log(`tsc --config=${p}`);
  return tscBuilder(p).then(() => {
    let src = path.resolve(rootDir, './src') + '/**/*.json';
    let dest = path.resolve(rootDir, './build');
    console.log(`copy css-metadata  ${chalk.bold.yellow(src)} -> ${chalk.bold.green(dest)}`  );
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
