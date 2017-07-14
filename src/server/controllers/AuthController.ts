import * as express from "express";
import wrap from "~/server/config/controllerWrap";



const router = express.Router();

export default app => {
  // invoked for any requests passed to this router
  router.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
  });

  router.use('/login', wrap(async(req, res) => {
    res.json({'data':true})
  }))


  app.use("/auth", router);
}