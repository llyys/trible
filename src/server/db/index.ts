import * as pgPromise from "pg-promise";
import { IMain, IDatabase, IOptions } from "pg-promise";
import { UsersRepository } from "./repos/usersRepository";
import * as config from "config";
import * as diagnostics from "./diagnostics";
import logger from "~/lib/Logger";
const log = logger.get("SQL");

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
    console.log("Connected to database:", cp.database);
  },
  disconnect: (client, dc) => {
    const cp = client.connectionParameters;
    console.log("Disconnecting from database:", cp.database);
  },
  error: (err, e) => {
    if (err instanceof QueryResultError) {
      // A query returned unexpected number of records, and thus rejected;

      // we can check the error code, if we want specifics:
      if (err.code === qrec.noData) {
        // expected some data, but received none;
      }

      // If you write QueryResultError into the console,
      // you will get a nicely formatted output.

      log.error(err);

      // See also: err, e.query, e.params, etc.
    }
  }
};

const pgp: IMain = pgPromise(dbOptions);
const QueryResultError = pgp.errors.QueryResultError;
const qrec = pgp.errors.queryResultErrorCode;

const connection = {
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password
};
// Create the database instance with extensions:
const db = <IDatabase<IRepositories> & IRepositories>pgp(connection);

diagnostics.init(dbOptions);
// If you ever need access to the library's root (pgp object), you can do it via db.$config.pgp
// See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
export = db;
