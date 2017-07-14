import * as express from "express";
import * as path from "path";

import routes from "~/routes";
import { serverRouter } from "~/server/config/serverRouter";
import { renderHtml } from "~/server/components/Html";
const router = serverRouter(routes);

export default app => {
  const manifestFile = path.join(__dirname, "../../manifest.json");
  const manifest = require(manifestFile);

  app.get("/*", async function(req: express.Request, res, next) {
    try {
      if (req.url.endsWith("hot-update.json")) {
        res.status(404).send({});
        return;
      }
      console.log(`request ${req.url}`);
      let state = {};

      const context = {
        req: req,
        res: res,
        path: req.url,
        env: "server",
        store: {}
      };

      const manifestItems = Object.keys(manifest).filter(
        x => !x.endsWith(".map")
      );

      //Script order is important here, ManifestPlugin does not export elements in order of entries
      const scripts = [manifest["vendor.js"], manifest["index.js"]];

      const styles = ["lib.css"];
      manifestItems.filter(x => x.endsWith(".css")).map(item => {
        styles.push(item);
      });

      let route = await router.resolve(context);
      renderHtml(res, context.store, route.component, scripts, styles);
    } catch (err) {
      console.log(err);
      next();
    }
  });

  //Global error handler
  app.use(function(err, req, res, next) {
    // log it
    console.log(`global error`);
    if (!module.parent) console.error(err.stack);

    // error page
    res.status(500).render("5xx");
  });

  // assume 404 since no middleware responded
  app.use(function(req, res, next) {
    console.log(`page not found`);
    res.status(404).render("404", { url: req.originalUrl });
  });
};
