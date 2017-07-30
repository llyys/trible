import * as path from "path";
import logger from "../../lib/Logger";
const log = logger.get(module);
const chalk: any = require("chalk");

var module_require: any = require("module");
var Module = module_require.Module;

var oldLoad = Module._load;
Module._load = function(request, parent, isMain) {
  var extension = path.extname(request) || ".js";
  if (extension === ".svg") {
    log.debug(`ignoring file in server render ${request}`);
    return {};
  }
  if (extension === ".scss") {
    // When using css modules we have generated json file to map the classnames with generated css names...
    let cssModel = path.resolve(
      path.dirname(parent.filename),
      request + ".json"
    );
    log.debug(`mapping ${request} with ${chalk.bold.white(cssModel)}`);
    let obj = require(cssModel);
    return obj;
  }
  var res = oldLoad(request, parent, isMain);
  return res;
};

//Since typescript compiler won't replace the ~ mapings so this code will do this for the runtime
const moduleAlias: any = require("module-alias");
log.debug(`mapping ~/ to ${path.join(__dirname, "../../")}`);
moduleAlias.addAlias("~", path.join(__dirname, "../../")); //map ~ to the correct path.
