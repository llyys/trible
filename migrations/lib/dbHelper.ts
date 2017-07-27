export function runListOfqueries(db, ...queries:string[] ) {
  let queriesPromises = queries.map((query) => db.runSql(query));
  return Promise.all(queriesPromises);
}