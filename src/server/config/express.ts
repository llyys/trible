import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as helmet from "helmet";
import * as reactView from "./reactView";
import * as path from "path";
import * as session from "express-session";
import * as express from "express";
import * as passport from "passport";
import db = require("~/server/db");
import { PgSessionStore } from "~/server/config/expressPgSessionStore";

export default (app: express.Express) => {
  app.set("view engine", "js");
  app.engine("js", reactView.createEngine({}));
  const viewsPath = path.join(__dirname, "../views");
  app.set("views", viewsPath);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  app.use(cookieParser());

  //Help secure Express apps with various HTTP headers
  app.use(helmet());
  const sess = session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: new PgSessionStore(db, session, {})
  });

  const urlsThatDontNeedSession = /((\/__webpack_hmr)|(\.(js|css|ico)))/
  app.use((req, res, next) => {
    if (urlsThatDontNeedSession.test(req.url)) {
      next();
    } else {
      sess(req, res, next);
    }
  });
  app.use(passport.initialize());
  app.use(passport.session());
  // app.on('error', onError); <- TODO
};

// interface ErrnoError extends Error {
//   errno?: number;
//   code?: string;
//   path?: string;
//   syscall?: string;
// }

// function onError(error: ErrnoError): void {
//   if (error.syscall !== 'listen') throw error;
//   let bind: string = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port.toString()}`;

//   switch (error.code) {
//     case 'EACCES':
//       console.error(`${bind} requires elevated privileges`);
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(`${bind} is already in use`);
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }
