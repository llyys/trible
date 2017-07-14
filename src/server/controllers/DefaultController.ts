import * as express from "express";


export default app => {
  // app.get('/', function (req, res, next) {
  //   //res.render('home'); // render home page view
  //   res.send('welcome to home');
  // });

  app.get("/api", function(req, res, next) {
    //res.render('home'); // render home page view
    res.send("welcome to api");
  });
};
