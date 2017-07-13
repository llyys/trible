const task = require('./task');
module.exports = task('hello', () => {
  setTimeout(() => {
    console.log('Hello world!');
  }, 3000);
});