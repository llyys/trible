interface Database{
checkDBMS(dbms, callback):Promise<any>
createDatabase(dbName, options, callback);  
switchDatabase(options, callback);
dropDatabase(dbName, options, callback);
bindForeignKey(tableName, columnName, fkOptions);
dropTable(tableName, options, callback);
renameTable(tableName, newTableName, callback);
addColumn(tableName, columnName, columnSpec, callback)
removeColumn(tableName, columnName, callback);
renameColumn(tableName, oldColumnName, newColumnName, callback);
changeColumn(tableName, columnName, columnSpec, callback);
addIndex(tableName, indexName, columns, unique, callback);
removeIndex(tableName, indexName, callback);
addForeignKey(tableName, referencedTableName, keyName, fieldMapping, rules, callback);
removeForeignKey(tableName, keyName, callback);
createMigrationsTable(callback);
createSeedsTable(callback);
runSql(...args):Promise<any>; 
createColumnDef(name, spec, options, tableName)
createColumnConstraint(spec, options, tableName, columnName)
deleteSeed(seedName, callback)
all(...params)
}
