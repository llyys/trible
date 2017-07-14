export default app => {
  app.get("/api", function(req, res, next) {
    //res.render('home'); // render home page view
    res.send("welcome to api");
  });

}