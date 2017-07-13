const task = require('./lib/task');
const path = require('path');
var DBMigrate = require('db-migrate');
module.exports = task('db-migrate', (args) => {
  return new Promise(function (resolve, reject) {
    console.log(`Beginning a migration project`)
    var dbm = DBMigrate.getInstance(true, specialCallback);
    dbm.up()
      .then(resolve)

  });
}, );

function specialCallback(migrator, originalError) {
  migrator.driver.close(function(err) {
    assert.ifError(originalErr);
    assert.ifError(err);
    log.info('Done');
  });
}