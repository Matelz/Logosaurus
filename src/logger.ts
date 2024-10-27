import fs from "fs";
import chalk from 'chalk';
import moment from "moment";
import { Request, Response, NextFunction } from "express";

type levelTypes = "INFO" | "WARN" | "ERROR" | "DEBUG" | "TRACE" | "FATAL" | "OFF" | undefined;

interface Log {
  type: string;
  timestamp: string;
  message?: string;
  level?: levelTypes;
  method: string;
  url?: string;
  body?: any;
  query?: any;
  params?: any;
  headers?: any;
  ip?: string;
  status?: number;
  responseTime?: number;
}

// Class to log messages to the console and a file
export default class Logger {
  private logTypes = ["message", "request", "response"];
  
  private logFolder = "./logs";
  private currentFile = "";
  private fileLogging = true;
  private consoleLogging = true;
  private utcOffset = "-03:00";
  private date = moment().utcOffset(this.utcOffset);

  // Factory function to create a log string based on the log type and output type
  private logStringFactory(type: string, output: string) {
    if (!this.logTypes.includes(type)) {
      throw new Error("Invalid log type");
    }

    return (log: Log) => {
      var method = "";

      if (output === "file") {
        method = log.method;
      } else {
        switch (log.method) {
          case "GET":
            method = chalk.green(log.method);
            break;
          case "POST":
            method = chalk.blue(log.method);
            break;
          case "PUT":
            method = chalk.yellow(log.method);
            break;
          case "DELETE":
            method = chalk.red(log.method);
            break;
          default:
            method = chalk.white(log.method);
            break;
        }
      }

      if (type === "request") {
        return `${log.timestamp} - [${log.level}] - [${method}] ${log.url} - ${log.ip}`;
      } else if (type === "response") {
        return `${log.timestamp} - [${log.level}] - [${method}] ${log.url} - ${log.ip} - ${log.status} - ${log.responseTime}ms`;
      } else {
        return `${log.timestamp} - [${log.level}] - ${log.message}`;
      }
    };
  }

  // Creates a new log file if one does not exist for the current day
  private createFile() {
    if (!this.fileLogging) {
      return;
    }

    if (!fs.existsSync(this.logFolder)) {
      fs.mkdirSync(this.logFolder);
    }

    // Check if there is any log file in the logs directory from today
    var timestamp = moment().utcOffset(this.utcOffset).toISOString(true).replace(/:/g, "\uA789");
    var logFiles = fs.readdirSync(this.logFolder);
    var found = false;

    for (var i = 0; i < logFiles.length; i++) {
      if (logFiles[i].includes(timestamp.split("T")[0])) {
        this.currentFile = `${this.logFolder}/${logFiles[i]}`;
        found = true;
        break;
      }
    }

    // If no log file was found, create a new one
    if (!found) {
      this.currentFile = `${this.logFolder}/${timestamp}.log`;
      fs.writeFileSync(this.currentFile, "");
    }
  }

  /**
   * @description Deletes all log files in the log folder
   * @example
   * logger.deleteLogs();
   * @returns {void}
   * 
  **/
  deleteLogs(): void {
    if(this.logFolder == ''){
      return;
    }

    // WARNING: This operation is irreversible and will delete all log files.
    fs.rm(this.logFolder, { recursive: true }, (err) => {
      if (err) {
        return;
      }
    });
  }

  // Writes the log message to a file
  private writeToFile(log: Log) {
    if (!this.fileLogging) {
      return;
    }

    var logString = this.logStringFactory(log.type, "file")(log);

    fs.appendFileSync(this.currentFile, logString + "\n");
  }

  // Writes the log message to the console
  private writeToConsole(log: Log) {
    if (!this.consoleLogging) {
      return;
    }

    var logString = this.logStringFactory(log.type, "console")(log);

    console.log(logString);
  }

  // Logs a message to the console and a file
  private logMessage(message: string, level: levelTypes = "INFO") {
    var log = {
      level: level,
      method: '',
      type: "message",
      timestamp: moment().utcOffset(this.utcOffset).toISOString(true),
      message: message,
    };

    this.writeToFile(log);
    this.writeToConsole(log);
  }

  /** 
    * @param {string} message The message to log
    * @description Logs an info message to the console and a file
    * @example
    * logger.info('This is an info message');
    * @returns {void}
  **/
  info(message: string): void {
    this.logMessage(message, "INFO");
  }

  /**
   * @param {string} message The message to log
   * @description Logs a warning message to the console and a file
   * @example
   * logger.warn('This is a warning message');
   * @returns {void}
  **/
  warn(message: string): void {
    this.logMessage(message, "WARN");
  }

  /**
   * @param {string} message The message to log
   * @description Logs an error message to the console and a file
   * @example
   * logger.error('This is an error message');
   * @returns {void}
  **/
  error(message: string): void {
    this.logMessage(message, "ERROR");
  }

  /**
   * @param {string} message The message to log
   * @description Logs a debug message to the console and a file
   * @example
   * logger.debug('This is a debug message');
   * @returns {void}
  **/
  debug(message: string): void {
    this.logMessage(message, "DEBUG");
  }

  /**
   * @param {string} message The message to log
   * @description Logs a trace message to the console and a file
   * @example
   * logger.trace('This is a trace message');
   * @returns {void}
  **/
  trace(message: string): void {
    this.logMessage(message, "TRACE");
  }

  /**
   * @param {string} message The message to log
   * @description Logs a fatal message to the console and a file
   * @example
   * logger.fatal('This is a fatal message');
   * @returns {void}
  **/
  fatal(message: string): void {
    this.logMessage(message, "FATAL");
  }

  /**
   * @param {Request} req The request object
   * @param {Response} res The response object
   * @param {NextFunction} next The next function
   * @description Logs the request to the console and a file
   * @example
   * app.use(logger.logRequest.bind(logger));
   * @returns {void}
   * **/
  logRequest(req: Request, res: Response, next: NextFunction): void {
    var timestamp = moment().utcOffset(this.utcOffset).toISOString(true);
    var method = req.method;
    var requestTime = moment().utcOffset(this.utcOffset).milliseconds();

    var log: Log = {
      level: "INFO",
      type: "request",
      timestamp: timestamp,
      method: method,
      url: req.url,
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
      ip: req.ip,
    };

    this.writeToFile(log);
    this.writeToConsole(log);

    res.on("finish", () => {
      var responseTime = moment().utcOffset(this.utcOffset).milliseconds() - requestTime;
      var responseLog: Log = {
        level: "INFO",
        type: "response",
        timestamp: moment().utcOffset(this.utcOffset).toISOString(true),
        method: method,
        url: req.url,
        ip: req.ip,
        status: res.statusCode,
        headers: res.getHeaders(),
        responseTime: responseTime,
      };

      this.writeToFile(responseLog);
      this.writeToConsole(responseLog);
    });

    next();
  }

  /**
   * @param {boolean} fileLogging Whether or not to log messages to a file
   * @param {boolean} consoleLogging Whether or not to log messages to the console
   * @param {string} logFolder The folder to store the log files
   * @param {string} utcOffset The UTC offset to use when logging
   * @description Initializes the logger
   * @example
   * const Logger = require('./util/logger');
   * const logger = new Logger(false, true, './logs', '-03:00');
   * @returns {Logger}
   **/
  constructor(fileLogging: boolean = true, consoleLogging: boolean = true, logFolder: string = "./logs", utcOffset: string = "-03:00", startMessage = true) {
    this.utcOffset = utcOffset;
    this.fileLogging = fileLogging;
    this.consoleLogging = consoleLogging;
    this.logFolder = logFolder;

    this.createFile();

    if (startMessage) {
        this.logMessage(`Logger initialized with UTC offset ${this.utcOffset}`);
    }
  }
}
