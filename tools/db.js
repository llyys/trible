const task = require('./lib/task');
const path = require('path');
var inflection = require('inflection');
const fs = require('fs');
var DBMigrate = require('db-migrate');
var Skeleton = require('db-migrate/lib/skeleton')
const config = require('config');
var yargs = require('yargs')


module.exports = task('db-migrate', (args) => {
  return new Promise(function (resolve, reject) {
   runCompleted = false
  yargs
  .command('create', 'create script command', function (yargs) {
    }, function (argv) {
      let name = argv._[1];
    console.log('creating script ' + name)
    createMigrationScript(name);
    runCompleted=true;
      return resolve();
  })
  .command('bar', 'bar command', {}, function (argv) {
    console.log('bar')
  })
  .argv    
  
  //return resolve()

if(runCompleted) 
  return;

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
      , plugins: { 'migrator:migration:hook:require': [tsPlugin] }
    }
    var dbm = DBMigrate.getInstance(true, conf, specialCallback);
    dbm.registerAPIHook().then(() =>
      dbm.run()
    )
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
  'migrator:migration:hook:require': function () {
    require('ts-helpers'); //so we could use the async/await
    require('ts-node').register({ compilerOptions: { "importHelpers": true } })
    return {
      extensions: 'ts'
    };
  }
};

function formatDate(date) {
  return [
    date.getUTCFullYear(),
    lpad(date.getUTCMonth() + 1, '0', 2),
    lpad(date.getUTCDate(), '0', 2),
    lpad(date.getUTCHours(), '0', 2),
    lpad(date.getUTCMinutes(), '0', 2),
    lpad(date.getUTCSeconds(), '0', 2)
  ].join('');
}

lpad = function(str, padChar, totalLength) {
  str = str.toString();
  var neededPadding = totalLength - str.length;
  for (var i = 0; i < neededPadding; i++) {
    str = padChar + str;
  }
  return str;
};



function createMigrationScript(name){
  const file = path.join(__dirname, '../migrations', `${formatDate(new Date())}-${inflection.dasherize(name)}.ts`)
 //fs.writeFileSync()
 console.log(file) 
 fs.writeFileSync(file, `'use strict';
 import * as utils from "./lib/dbHelper";
 
 exports.up = async(db:Database) => {
   
 }

 exports.down = async(db:Database) => {

 }
 `, )
}