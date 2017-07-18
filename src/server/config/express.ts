
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as reactView from './reactView';
import * as path from 'path';

export default (app) => {
  app.set('view engine', 'js');
  app.engine('js', reactView.createEngine({}));
  const viewsPath = path.join(__dirname, '../views');
  app.set('views', viewsPath);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  app.use(cookieParser());

  //Help secure Express apps with various HTTP headers
  app.use(helmet());
}