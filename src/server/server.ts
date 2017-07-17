import * as express from "express";
import * as path from "path";


import dotenv = require("dotenv");
require('./config/alias')

dotenv.config({
  silent: true,
  path: path.join(__dirname, "../.env")
});
const environment = process.env.NODE_ENV;
import expressConfig from "./config/express";
import {initialize} from "./config/controllerManager";
import expressController from "./controllers/expressController";
import {AuthController} from "./controllers/authController";
import { ApiController } from "./controllers/ApiController";

const server: express.Express = express();
var port = process.env.PORT || 3000;

expressConfig(server);

var rootPath = path.join(__dirname, '../../')
if (environment === "development") {
  console.log("---- DEVELOPMENT ENVIRONMENT ----")
  console.log("Setting up react Hot module reloader, please wait...")

  const webpackHotReload:any = require("./config/middleware/webpackHotReload");
  webpackHotReload.default(server, path.join(rootPath, 'webpack.config.js'));

  //so browser could show sourcemap real file content.
  server.use('/src', express.static(path.join(rootPath, 'src')));
  server.use('/node_packages', express.static(path.join(rootPath, 'node_packages')));
}



var publicPath = path.join(rootPath, "public");
//server.use("/public", express.static(publicPath));
server.use('/public', express.static(path.join(rootPath, "/build/public")));

initialize(server, 
  [AuthController, ApiController]
).then(()=>{
  expressController(server, {port, rootPath});
});
export default server;