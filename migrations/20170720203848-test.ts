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
  console.log('setting up')
  
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

// function getMethods(obj) {
//   var result = [];
//   for (var id in obj) {
//     try {
//       if (typeof(obj[id]) == "function") {
//         result.push(id + ": " + obj[id].toString());
//       }
//     } catch (err) {
//       result.push(id + ": inaccessible");
//     }
//   }
//   return result;
// }

exports.up = async(db:Database) => {
  
  //console.log(getMethods(db).join("\n"))
  console.log('running up')
  let tableUsers = new Table(db, 'users');
  await tableUsers.createSequence()
  await tableUsers.create({
    id: { type: 'int', primaryKey: true },
    displayName: 'string',
    users_profile_id: 'int'
  })

  let tableUsersProfile = new Table(db,'users_profile')
  await tableUsersProfile.create({
    id: { type: 'int', primaryKey: true, defaultValue:"nextval('users_profile_id_seq')" },
    displayName: 'string',
    provider: 'string',
    data: 'json',
    user_id: 'int',
  });

  console.log("running this")
  // debugger;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
