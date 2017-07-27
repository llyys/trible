const task = require("./lib/task");
const path = require("path");
var inflection = require("inflection");
const fs = require("fs");
var DBMigrate = require("db-migrate");
var Skeleton = require("db-migrate/lib/skeleton");
const config = require("config");
var yargs = require("yargs");

const logger = require("../build/lib/Logger").default;
const log = logger.get(module);

module.exports = task("db-migrate", args => {
    //  yargs
    //    .command('create', 'create script command', function (yargs) {
    //    }, function (argv) {
    //      let name = argv._[1];
    //      log.info('creating script ' + name)
    //      createMigrationScript(name);
    //      runCompleted = true;
    //      return resolve();
    //    })
    //    .command('bar', 'bar command', {}, function (argv) {
    //      log.info('bar')
    //    })
    //    .argv;

    let dbConfig = config.get("db");
    let conf = {
      config: {
        default: "dev",
        dev: {
          driver: "pg",
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.database
        }
      },
      plugins: { "migrator:migration:hook:require": [tsPlugin] }
    };

    let commands = yargs.argv;
    let actions = commands._;
    let action = actions.shift();
    var dbm = DBMigrate.getInstance(true, conf);
    switch (action) {
      case "create":
        let name = actions.shift();
        log.info("creating script " + name);

        createMigrationScript(name);
        return Promise.resolve();
      case "up":
        return new Promise((resolve, reject) => {
          dbm.up().then((res) => {
            resolve(res);
          }).catch(function (e) {
            reject(e.originalErr);
          });
        });
      default:

        // log.info(
        //   `Beginning a migration project with: ${JSON.stringify(
        //     conf.config.dev
        //   )}`
        // );
        // var dbm = DBMigrate.getInstance(
        //   true,
        //   conf
        //   //, (migrator, originalErr, data) => {
        //   //   migrator.driver.close(err => {
        //   //     if (err) {
        //   //       return reject(err);
        //   //     }
        //   //     log.info('Migrator driver close');
        //   //     return;
        //   //   });
        //   //   resolve();
        //   // }
        // );
        // dbm.registerAPIHook().then(() => dbm.run());
    }
});

function specialCallback(migrator, originalError) {
  migrator.driver.close(function(err) {
    if (err) {
      log.err(`Migration error:${err}`);
    }
    //assert.ifError(originalErr);
    //assert.ifError(err);
    log.info("Migrator driver close");
  });
}

const tsPlugin = {
  "migrator:migration:hook:require": function() {
    require("ts-helpers"); //so we could use the async/await
    require("ts-node").register({ compilerOptions: { importHelpers: true } });
    return {
      extensions: "ts"
    };
  }
};

function formatDate(date) {
  return [
    date.getUTCFullYear(),
    lpad(date.getUTCMonth() + 1, "0", 2),
    lpad(date.getUTCDate(), "0", 2),
    lpad(date.getUTCHours(), "0", 2),
    lpad(date.getUTCMinutes(), "0", 2),
    lpad(date.getUTCSeconds(), "0", 2)
  ].join("");
}

lpad = function(str, padChar, totalLength) {
  str = str.toString();
  var neededPadding = totalLength - str.length;
  for (var i = 0; i < neededPadding; i++) {
    str = padChar + str;
  }
  return str;
};

function createMigrationScript(name) {
  const file = path.join(
    __dirname,
    "../migrations",
    `${formatDate(new Date())}-${inflection.dasherize(name)}.ts`
  );
  //fs.writeFileSync()
  log.info(file);
  fs.writeFileSync(
    file,
    `/// <reference path="./lib/Database.d.ts" />
'use strict';
 import * as utils from "./lib/dbHelper";

 exports.setup = function(options, seedLink) {
  console.log('setting up ${name} task')
 };

 exports.up = async(db:Database) => {
  return await utils.runListOfqueries(db,
    'CREATE TABLE'
  );
 }

 exports.down = async(db:Database) => {
  return await utils.runListOfqueries(db,
    'DROP TABLE '
  );
 }
 `
  );
}
