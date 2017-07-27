import * as pgPromise from 'pg-promise';
import { IMain, IDatabase, IOptions } from "pg-promise";
import { UsersRepository } from "./repos/usersRepository";
import * as config from 'config';
import * as diagnostics from './diagnostics';

interface IRepositories {
  users: UsersRepository;
}



const dbOptions: IOptions<IRepositories> = {

  // Extending the database protocol with our custom repositories;
  // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
  extend: (obj: IRepositories, dc: any) => {
    // Database Context (dc) is only needed when extending multiple databases.
    obj.users = new UsersRepository(obj, pgp);
  },
  connect: (client, dc, isFresh) => {
    const cp = client.connectionParameters;
    console.log('Connected to database:', cp.database);
  },
  disconnect: (client, dc) => {
    const cp = client.connectionParameters;
    console.log('Disconnecting from database:', cp.database);
 }
};

const pgp: IMain = pgPromise(dbOptions);
const connection = {
  host:config.db.host,
  port:config.db.port,
  database:config.db.database,
  user:config.db.user,
  password:config.db.password,
}
// Create the database instance with extensions:
const db = <IDatabase<IRepositories> & IRepositories>pgp(connection);

diagnostics.init(dbOptions);
// If you ever need access to the library's root (pgp object), you can do it via db.$config.pgp
// See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
export = db;