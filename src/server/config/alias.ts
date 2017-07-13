import * as path from 'path'

var module_require:any = require('module')
var Module = module_require.Module;

var oldLoad = Module._load;
Module._load = function (request, parent, isMain) {
  var extension = path.extname(request) || '.js';
  if (extension === '.svg') {
    console.log(`ignoring file in server render ${request}`)
    return {}
  }
  if (extension === '.scss') {
    let cssModel = path.resolve(path.dirname(parent.filename), request + '.json');
    console.log(`ignoring file in server render ${request}`)
    let obj = require(cssModel);
    return obj;
  }
  var res = oldLoad(request, parent, isMain);
  return res;
};

const moduleAlias:any = require('module-alias');
moduleAlias.addAlias('~', path.join(__dirname, '../../'));
