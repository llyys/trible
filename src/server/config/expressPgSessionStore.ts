import db = require("~/server/db");
import { IDatabase, IMain, IBaseProtocol } from "pg-promise";
import { EventEmitter } from "events";
import * as session from "express-session";
import logger from "~/lib/Logger";
const log = logger.get(module);

type Callback = (err?: Error, result?: any) => any;

export class PgSessionStore extends session.Store {
  constructor(db: IDatabase<any>, session, options: any) {
    super();
    this.options = options || {};
    var Store = session.Store;

    this.table = options.table || "session";
    this.db = db;
  }
  db: IDatabase<any>;
  options: any;
  table: string;

  destroy(sid: string, fn: Callback) {
    db
      .none(`DELETE FROM ${this.table} where sid=$1`, sid)
      .then(() => fn(null, null));
  }

  get(sid: string, fn: Callback) {
    log.debug(`Loading session ${sid} from store `);
    let now = this.currentTimestamp();
    db
      .oneOrNone(
        `SELECT sess FROM ${this.table}
         where sid=$1 AND expire >= to_timestamp($2)`,
        [sid, now]
      )
      .then(res => {
        if (res) {
          let sess = { cookie: {}, ...res.sess };
          return fn(null, sess);
        }
        fn(null, { cookie: {} });
      });
  }

  serialize(sess) {
    return JSON.stringify(sess, function(key, val) {
      // ignore sess.cookie property
      if (key === "cookie") {
        return;
      }
      return val;
    });
  }

  private async createOrUpdate(sid: string, sess: any, expireTime: any) {
    //new pg9.5 feature UPSERT
    await db.none(
      `INSERT INTO ${this.table} (sid, sess, expire)
         VALUES ($(sid), $(sess), to_timestamp($(expireTime)))
      ON CONFLICT (sid) DO
         UPDATE SET sess = $(sess), expire = to_timestamp($(expireTime))
         `,
      { sid, sess, expireTime }
    );
    return;

    // let result = await db.oneOrNone(
    //   `UPDATE ${this.table}
    //     SET sess = $1, expire = to_timestamp($2)
    //     WHERE sid = $3 RETURNING sid`,
    //   [sess, expireTime, sid]
    // );
    // if (result) {
    //   return;
    // }
    // await db.none(
    //   `INSERT INTO ${this.table} (sid, sess, expire)
    //    VALUES ($(sid), $(sess), to_timestamp($(expireTime)))`,
    //   { sid, sess, expireTime }
    // );
  }

  set(sid: string, session: any, fn: Callback) {
    const expireTime = this.getExpireTime(session.cookie.maxAge);
    let sess = this.serialize(session);
    if (sess === "{}") {
      fn();
      return;
    }
    this.createOrUpdate(sid, sess, expireTime).then(() => fn());
  }

  touch(sid: string, session: any, fn: Callback) {
    const expireTime = this.getExpireTime(session.cookie.maxAge);

    db
      .oneOrNone(
        `UPDATE ${this.table}
       SET expire = to_timestamp($1) WHERE sid = $2 RETURNING sid`,
        [expireTime, sid]
      )
      .then(() => fn(null))
      .catch(err => fn(err));
  }

  private currentTimestamp() {
    return Math.ceil(Date.now() / 1000);
  }
  private getExpireTime(maxAge) {
    let oneDay,
      ttl = 86400; //oneDay

    ttl = ttl || (typeof maxAge === "number" ? maxAge / 1000 : oneDay);
    ttl = Math.ceil(ttl + this.currentTimestamp());

    return ttl;
  }

  dbCleanup(store) {
    var now = new Date().getTime();
    this.db.none(`DELETE FROM ${this.table} WHERE to_timestamp($1) > expire`, [
      now
    ]);
  }
}
