const task = require('./lib/task');
const buildClientTask = require('./build-client');
const buildServerTask = require('./build-server');
const buildCssTask = require('./build-css');

const cleanTask = require('./clean');

const rimrafPromise = (pattern) => {
   return new Promise(function(resolve,reject){
     rimraf(pattern, resolve);
    });
}

module.exports = task('build-all', async () => {
  console.log('build-all');
  await cleanTask();
  //await buildClientTask();
  await Promise.all([buildServerTask(), buildClientTask(), buildCssTask()]);

});