import * as bluebird from "bluebird";
import * as glob from "glob";
import * as fs from "fs";
import * as express from "express";
import { Express, Router } from "express";

// export default (app, routePath) => {
//   processFlatRoutePath(app, routePath);
// };

// const jsFile = file => /\.js$/i.test(file);

// function processFlatRoutePath(app, routePath) {
//   fs.readdirSync(routePath).filter(jsFile).forEach(function(file) {
//     var route = routePath + "/" + file;
//     console.log(`binding ${route}`);
//     let module:any = require(route);
//     module.default(app);
//   });
// }

// function processRecursiveRoutePath(app, route_path) {
//   fs.readdirSync(route_path).filter(jsFile).forEach(function(file) {
//     var filepath = route_path + "/" + file;
//     fs.stat(filepath, function(err, stat) {
//       if (stat.isDirectory()) {
//         processRecursiveRoutePath(app, filepath);
//       } else {
//         console.info("Loading route: " + filepath);
//         require(filepath)(app);
//       }
//     });
//   });
// }


let routers = new Array<Router>();
let requestMappings = new Array<RequestMapping>();


export interface RequestMapping {
    targetName;
    functionName: string;
    method: "get" | "post" | "patch" | "put" | "delete";
    path: string;
}

const globPromise = bluebird.promisify(glob);

export async function initialize(app: Express, targets: Array<Function> | Array<string>) {
    for (let target of targets) {
        if (typeof target != "string") break;
        let files: any = await globPromise(target);

        let filteredFiles = files.filter(file => {
            return !file.endsWith(".d.ts")
        });

        for (let file of filteredFiles) {
            require(file);
        }
    }

    for (let router of routers) {
        app.use(router);
    }
}

//constructed by using Controller decorator
export function createRouter(target, baseUrls: string[]) {
    let router = Router();
    let controller = new target();

    for (let baseUrl of baseUrls) {
        let filteredMappings = requestMappings.filter(mapping => {
            return mapping.targetName == target.name;
        });

        for (let mapping of filteredMappings) {
            let method = mapping.method;
            let uri: string;

            if (baseUrl == "/") uri = mapping.path;
            else uri = `${baseUrl}${mapping.path}`;

            let requestMiddleware = function(req, res, next) {
              let ret = controller[mapping.functionName](req, res, next);
              if (ret != null && ret["catch"] != null && typeof ret["catch"] == "function") {
                  // Handle promise rejection, if the mapped function throws any error.
                  ret.catch(err => {
                      next(err);
                  });
              }
            };

            // let authMapping = authMappings.find(aMapping => {
            //     return (aMapping.targetName == mapping.targetName) && (aMapping.functionName == mapping.functionName);
            // });

            // if (authMapping) {
            //     router[method](uri, passport.authenticate(authMapping.strategies), requestMiddleware);
            // } else {
                router[method](uri, requestMiddleware);
            // }
        }
    }
    routers.push(router);
}

export function mapRequest(target, functionName: string,
                           method: "get" | "post" | "patch" | "put" | "delete", path: string) {
    requestMappings.push({
        targetName: target.constructor.name,
        functionName: functionName,
        method: method,
        path: path
    });
}
