"use strict";

const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const process = require("process");
const chalk = require('chalk');
const log = console.log;
const error = chalk.bold.red;

function reportDiagnostics(diagnostics) {
    diagnostics.forEach(diagnostic => {
        let message = "Error";
        if (diagnostic.file) {
            const where = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            message += ' ' + diagnostic.file.fileName + ' ' + where.line + ', ' + where.character + 1;
        }
        message += ": " + error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        log(message);
    });
}

function readConfigFile(configFileName) {
    // Read config file
    const configFileText = fs.readFileSync(configFileName).toString();

    // Parse JSON, after removing comments. Just fancier JSON.parse
    const result = ts.parseConfigFileTextToJson(configFileName, configFileText);
    const configObject = result.config;
    if (!configObject) {
        reportDiagnostics([result.error]);
        process.exit(1);
    }

    // Extract config infromation
    const configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(configFileName));
    if (configParseResult.errors.length > 0) {
        reportDiagnostics(configParseResult.errors);
        process.exit(1);
    }
    return configParseResult;
}


function compile(configFileName) {
  return new Promise(function (resolve, reject) {
    // Extract configuration from config file
    const config = readConfigFile(configFileName);

    // Compile
    const program = ts.createProgram(config.fileNames, config.options);
    const emitResult = program.emit();

    // Report errors
    const errors = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    reportDiagnostics(errors);
    if (errors.length > 0) {
      return reject(error('build failed...'));
    }
    // Return code
    // const exitCode = emitResult.emitSkipped ? 1 : 0;
    // process.exit(exitCode);
    resolve();
  })
}

module.exports = compile;