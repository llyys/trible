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

exports.up = async(db) => {
  return utils.runListOfqueries(db,
    `CREATE OR REPLACE FUNCTION now_utc() RETURNS TIMESTAMP as $$
      SELECT now() at time zone 'utc';
    $$ language sql;`,

    `CREATE SEQUENCE users_id_seq`,
    `CREATE TABLE users
    (
        users_id BIGINT PRIMARY KEY NOT NULL default nextval('users_id_seq'),
        displayName TEXT,
        avatar TEXT,
        created_dt TIMESTAMP DEFAULT now_utc() NOT NULL
    )
    `,

    `CREATE SEQUENCE users_profile_id_seq`,
    `CREATE TABLE users_profile
    (
        users_profile_id BIGINT PRIMARY KEY NOT NULL default nextval('users_profile_id_seq'),
        users_id BIGINT REFERENCES users NOT NULL,
        username TEXT,
        provider TEXT NOT NULL,
        providerId TEXT NOT NULL,
        providerData JSON NOT NULL,
        created_dt TIMESTAMP DEFAULT now_utc() NOT NULL
    )
    `
  )

};

exports.down = async(db) => {
  return utils.runListOfqueries(db
    , `DROP SEQUENCE users_id_seq`
    , `DROP SEQUENCE users_profile_id_seq`
    , `DROP TABLE users_profile`
    , `DROP TABLE users`
  );
};

exports._meta = {
  "version": 1
};
