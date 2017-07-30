import * as express from "express";
import * as path from "path";
import * as fs from "fs";

require("./config/alias"); // this must be in the beginning

import logger from "~/lib/Logger";
const log = logger.get(module);

const environment = process.env.NODE_ENV;
import expressConfig from "./config/express";
import { initialize } from "./config/controllerManager";
import expressController from "./controllers/expressController";
import { AuthController } from "./controllers/authController";
import { ApiController } from "./controllers/ApiController";

import * as passport from "./config/passport/passport";

const server: express.Express = express();
var port = process.env.PORT || 3000;

expressConfig(server);

var rootPath = path.join(__dirname, "../../");
if (environment === "development") {
  log.info("---- DEVELOPMENT ENVIRONMENT ----");
  log.info("Setting up react Hot module reloader, please wait...");

  const webpackHotReload: any = require("./config/middleware/webpackHotReload");
  webpackHotReload.default(server, path.join(rootPath, "webpack.config.js"));

  //so browser could show sourcemap real file content.
  server.use("/src", express.static(path.join(rootPath, "src")));
  server.use(
    "/node_packages",
    express.static(path.join(rootPath, "node_packages"))
  );
}

var publicPath = path.join(rootPath, "public");
//server.use("/public", express.static(publicPath));
server.use("/public", express.static(path.join(rootPath, "/build/public")));
server.get("/favicon.ico", function(req, res) {
  res.sendStatus(204); //no content
});

initialize(server, [AuthController, ApiController]).then(() => {
  passport.configureRoutes(server);
  expressController(server, { port, rootPath });
});

export default server;
