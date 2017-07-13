const webpackConfig = require("../webpack.config");
const mkdirp = require("mkdirp");
const task = require("./lib/task");
var sass = require("node-sass");
const fs = require("fs");
const path = require("path");
const chalk = require('chalk');
const log = console.log;
var postcss = require("postcss");

const error = chalk.bold.red;
const info = chalk.bold.green;

const isDebug = !process.argv.includes("--release");
const isVerbose = process.argv.includes("--verbose");

const autoprefixer = require("autoprefixer");

module.exports = task("build-css", (src_file, dest_file) => {
  let vendor = path.resolve(
    __dirname,
    "../",
    "./src/style/lib.scss"
  );
  const destFile = path.resolve(webpackConfig.output.path, "lib.css");

  return processSass({
    file: vendor,
    outputStyle: isDebug ? "compact" : "compressed",
    sourceComments: isDebug,
    sourceMap: isDebug,
    sourceMapEmbed: isDebug,
    sourceMapRoot: '../'
  })
    // .then(result => {
    //   return postcss([
    //     autoprefixer({
    //       browsers: ["last 2 versions", "ie >= 9"]
    //     })
    //   ]).process(result, { map: { inline: true } })
    //   }
    // )
    .then(result => {
      writeFile(destFile, result);
      log(`build-css ${chalk.bold.yellow(vendor)} -> ${info(destFile)}`);
    }).catch(err => {
      log(err);
    });
});

function writeFile(fileName, content) {
  const dirPath = path.dirname(fileName);
  return new Promise((resolve, reject) => {
    mkdirp(dirPath, (err, made) => {
      if (err)
        return reject(err);

      fs.writeFile(fileName, content, (fwErr, fwDone) => {
        if (fwErr)
          return reject(fwErr);
        resolve();
      });
    });
  });
}

function processSass(options) {
  return new Promise((resolve, reject) => {
    sass.render(options, function(err, res){
      if (err)
      {
        log(error(err));
        return reject(err);
      }
      resolve(res.css);
    });
  });
}
