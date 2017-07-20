import * as React from "react";
import * as ReactDOM from "react-dom/server";
import * as path from "path";
const environment = process.env.NODE_ENV;
export function createEngine(engineOptions) {
  var registered = false;
  var moduleDetectRegEx;

  //engineOptions = assign({}, DEFAULT_OPTIONS, engineOptions || {});

  function renderView(filePath:string, options:any, cb) {
    
    try {
      var markup = engineOptions.doctype||'<!doctype html>';
      let component:any = require(filePath);
      // Transpiled ES6 may export components as { default: Component }
      component = component.default || component;
      markup += ReactDOM.renderToStaticMarkup(
        React.createElement(component, options)
      );
      const {req, res}=options;
      if(res){
        if (environment === "development"){
          res.setHeader('Cache-Control', 'no-store, must-revalidate')
        }

        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Content-Length', Buffer.byteLength(markup))  
      }

    } catch (e) {
      return cb(e);
    } finally {
      if (options.settings.env === 'development') {
        // Remove all files from the module cache that are in the view folder.
        // Object.keys(require.cache).forEach(function(module) {
        //   if (moduleDetectRegEx.test(require.cache[module].filename)) {
        //     delete require.cache[module];
        //   }
        // });
      }
    }

    cb(null, markup); //(err, html)
  }

  return renderView;
}
