enum LogLevel {
  Off = 0,
  Info = 1,
  Debug = 2,
  All = 3,
}

class Logger {
  private readonly logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.Info) {
    this.logLevel = logLevel;
  }

  public log(logMessage: string, logLevel: LogLevel): void {
    if (this.logLevel >= logLevel) {
      console.log(`search-integrator [${LogLevel[logLevel]}]: ${logMessage}`);
    }
  }
}

export { Logger, LogLevel };
