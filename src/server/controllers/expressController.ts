import * as express from "express";
import * as path from "path";
import * as glob from "glob";
import * as fs from "fs";
import logger from "~/lib/Logger";
const log = logger.get("global");

import routes from "~/routes";
import { serverRouter } from "~/server/config/serverRouter";

const router = serverRouter(routes);
export default (app, { port, rootPath }) => {
  app.get("/*", async function(req: express.Request, res, next) {
    try {
      if (req.url.endsWith("hot-update.json")) {
        res.status(404).send({});
        return;
      }
      console.log(`request ${req.url}`);

      const context = {
        req: req,
        res: res,
        path: req.url,
        env: "server",
        state: { route: {} }
      };

      //context.store.token = req["session"];

      let route = await router.resolve(context);
      res.render("Page", {
        component: route.component,
        state: context.state,
        req,
        res
      });
    } catch (err) {
      console.log(err);
      next();
    }
  });

  //Global error handler
  app.use(function(err, req, res, next) {
    // log it
    log.error(err.stack);
    if (res.headersSent) {
      return next(err);
    }
    // error page
    res.status(500).render("500", { error: err });
  });

  // assume 404 since no middleware responded
  app.use(function(req, res, next) {
    console.log(`page not found`);
    res.status(404).render("404", { url: req.originalUrl });
  });

  app.listen(port, () => {
    console.log(`✓' Express server listening on port ${port}.`);
    clenupHotUpdateFiles();
  });

  function clenupHotUpdateFiles() {
    const appPath = path.join(rootPath, "/build/public");
    glob(appPath + "/*.hot-update.*", (err, files) => {
      files.forEach(function(item, index, array) {
        //console.log(item + " found");
        fs.unlink(item, function(err) {
          if (err) throw err;
          console.log(item + " deleted");
        });
      });
    });
  }
};
