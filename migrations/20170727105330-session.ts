/// <reference path="./lib/Database.d.ts" />
"use strict";
import * as utils from "./lib/dbHelper";
exports.setup = function(options, seedLink) {
  console.log('setting up')

};


exports.up = async (db: Database) => {
  return utils.runListOfqueries(
    db,
    `CREATE TABLE session (
      sid varchar NOT NULL COLLATE "default",
      sess json NOT NULL,
      expire timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);`,
    `ALTER TABLE session ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;`
  );
};

exports.down = async (db: Database) => {
  return utils.runListOfqueries(db,
    `DROP TABLE session`
  );
};
