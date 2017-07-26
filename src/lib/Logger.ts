import undefined from '../server/config/passport/strategys/facebook';
import * as path from 'path';
const chalk:any = require('chalk');
const log = console.log;

const rootPath = __dirname;

export class LoggerFactory {
  private cache: { [module: string]: Logger } = {};
  get(module: NodeModule): Logger {
    return (
      this.cache[module.id] || (this.cache[module.id] = new Logger(module))
    );
  }
}

export class Logger {
  module: NodeModule;
  modulePath: string;
  constructor(module: NodeModule) {
    this.module = module;
    this.modulePath = path.relative(rootPath, this.module.filename).replace("..\\", "");
  }

  debug(msg: any, ...args: any[]): void {
		log(chalk.green(this.moduleName()),  "DEBUG:" ,this.format(msg, args));
  }
  info(msg: any, ...args: any[]): void {
		log(chalk.green(this.moduleName()),  "INFO:" ,this.format(msg, args));
  }
  error(msg: any, ...args: any[]): void {
		log(chalk.green(this.moduleName()),  "ERROR:" ,this.format(msg, args));
  }
  warn(msg: any, ...args: any[]): void {
		log(chalk.green(this.moduleName()),  "WARN:" ,this.format(msg, args));
  }

  private moduleName() {
    return `[${this.modulePath}]`
  }

  private format(message: string, ...args: any[]) {
		return message.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	}
}

const factory = new LoggerFactory()

export default factory;