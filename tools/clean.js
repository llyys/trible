const task = require('./lib/task');
const path = require('path');
const rimraf = require('rimraf');
module.exports = task('clean', (inf) => {
  let p = path.resolve(__dirname, '../build');
  return new Promise(function (resolve, reject) {
    console.log(`delting ...${inf} ${p}`)
    rimraf(p, resolve);
  });
}, );