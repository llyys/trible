import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as webpack from 'webpack';

export default (app, webpackConfigPath) => {
  console.log('initializing a webpack-hot-middleware from ' + webpackConfigPath);
  let webpackConfig:any = require(webpackConfigPath)
  const compiler = webpack(webpackConfig);

  //Attach the dev middleware to the compiler & the server
  app.use(webpackDevMiddleware(compiler, {
    filename: webpackConfig.output.filename,
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    //historyApiFallback: true,
    stats: {
      colors: true,
    },
  }));

  //Attach the hot middleware to the compiler & the server
  app.use(webpackHotMiddleware(compiler, {
    log: console.log, // eslint-disable-line no-console
    path: "/__webpack_hmr",
    heartbeat: 10 * 1000
  }))
}