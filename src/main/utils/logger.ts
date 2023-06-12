enum LogLevel {
  Off = 0,
  Info = 1,
  Debug = 2,
  All = 3,
}

class Logger {
  private readonly logLevel: LogLevel;
  private static logger: Logger;

  private constructor(logLevel: LogLevel = LogLevel.Info) {
    this.logLevel = logLevel;
  }

  public log(logMessage: string, logLevel: LogLevel): void {
    if (Logger.logger.logLevel >= logLevel) {
      console.log(`search-integrator [${LogLevel[logLevel]}]: ${logMessage}`);
    }
  }

  public static getLogger(logLevel?: LogLevel) {
    if (!Logger.logger || Logger.logger.logLevel !== logLevel) {
      Logger.logger = new Logger(logLevel);
    }

    return Logger.logger;
  }
}

export { Logger, LogLevel };
