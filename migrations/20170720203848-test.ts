'use strict';

var dbm;
var type;
var seed;

//var {Table} = require("./lib/dbHelper")
import * as utils from "./lib/dbHelper";
/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  console.log('setting up')
  
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async(db:Database) => {
  utils.runListOfqueries(db, 
    `CREATE OR REPLACE FUNCTION now_utc() RETURNS TIMESTAMP as $$
      SELECT now() at time zone 'utc';
    $$ language sql;`,
    
    `CREATE SEQUENCE users_id_seq`,
    `CREATE TABLE users
    (
        users_id BIGINT PRIMARY KEY NOT NULL default nextval('users_id_seq'),
        displayName TEXT,
        media_url TEXT,
        created_dt TIMESTAMP DEFAULT now_utc() NOT NULL,
        created_by TEXT
    )
    `,

    `CREATE SEQUENCE users_profile_id_seq`,
    `CREATE TABLE users_profile
    (
        users_profile_id BIGINT PRIMARY KEY NOT NULL default nextval('users_profile_id_seq'),
        users_id BIGINT REFERENCES users,
        displayName TEXT,
        username TEXT,
        provider TEXT,
        providerData JSON,
        created_dt TIMESTAMP DEFAULT now_utc() NOT NULL,
        created_by TEXT
    )
    `
  )

  console.log("running this")
  // debugger;
};

exports.down = async(db) => {
  return null;
};

exports._meta = {
  "version": 1
};
