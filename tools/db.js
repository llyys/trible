const task = require('./lib/task');
const path = require('path');
var DBMigrate = require('db-migrate');
const config = require('config');

module.exports = task('db-migrate', (args) => {
  return new Promise(function (resolve, reject) {
    console.log(`Beginning a migration project`)
    let dbConfig = config.get('db');
    let conf = {
      config: {
        default: "dev",
        dev: {
          "driver": "pg",
          "user": dbConfig.user,
          "host": dbConfig.host,
          "password": dbConfig.password,
          "database": dbConfig.database
        }
      }
      , plugins:{'migrator:migration:hook:require':[tsPlugin]}
    }
    var dbm = DBMigrate.getInstance(true, conf, specialCallback);
    dbm.registerAPIHook().then(()=>
      dbm.run()
    )
    // dbm.up()
    //   .then(resolve)

  });
}, );

function specialCallback(migrator, originalError) {
  migrator.driver.close(function (err) {
    //assert.ifError(originalErr);
    //assert.ifError(err);
    console.log('Migrator driver close');
  });
}


const tsPlugin = {
      'migrator:migration:hook:require': function() {
        // We use ts-node because the official TypeScript module does not implement the register() method
        require('ts-helpers'); //so we could use the async/await
        require('ts-node').register({ compilerOptions: {"importHelpers": true} })
        return {
          extensions: 'ts'
        };
      }
    };
  