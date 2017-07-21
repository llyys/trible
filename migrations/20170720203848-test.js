'use strict';

var dbm;
var type;
var seed;

var {Table} = require("./lib/dbHelper")

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {

  let tableUsers = new Table(db, 'users');
  await tableUsers.create({
    id: { type: 'int', primaryKey: true },
    displayName: 'string',
    users_profile_id: 'int'
  })

  let tableUsersProfile = new Table(db,'users_profile')
  await tableUsersProfile.create({
    id: { type: 'int', primaryKey: true },
    displayName: 'string',
    provider: 'string',
    data: 'json',
    user_id: 'int',
  });

  console.log("running this")
  debugger;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
