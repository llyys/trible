class Table{

 constructor(db, name){
    this.db = db ;
    this.name = name ;
 }

 create(obj){
   return this.db.createTable(this.name, obj);
 }

 addColumn(columnName, dataType) {
  return this.db.runSql(`ALTER TABLE ${this.name} ADD COLUMN ${columnName} ${dataType}`);
 };

 print(){
    console.log('Name is :'+ this.name);
 }
}
exports.createSequence = function (db, name) {
  return db.runSql(`create sequence name`);
};

dropConstraint = function (db, tableName, constraintName) {
  return db.runSql(`ALTER TABLE ${tableName} DROP CONSTRAINT ${constraintName}`);
};

exports.Table = Table;
exports.dropConstraint = dropConstraint;
