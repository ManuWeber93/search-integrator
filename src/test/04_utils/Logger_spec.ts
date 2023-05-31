import { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chai from "chai";
import { Logger, LogLevel } from "../../main/utils/Logger.js";

chai.use(sinonChai);

describe("Logger Test", () => {
  let logger;
  let consoleLogSpy: sinon.SinonSpy<
    [message?: any, ...optionalParams: any[]],
    void
  >;

  beforeEach(() => {
    consoleLogSpy = sinon.spy(console, "log");
  });

  afterEach(() => {
    consoleLogSpy.restore();
  });

  it("should log messages with the appropriate log levels", () => {
    logger = new Logger(LogLevel.All);

    logger.log("Info message", LogLevel.Info);
    logger.log("Debug message", LogLevel.Debug);

    expect(consoleLogSpy).to.have.been.calledWith(
      "search-integrator [Info]: Info message"
    );

    expect(consoleLogSpy).to.have.been.calledWith(
      "search-integrator [Debug]: Debug message"
    );
  });

  it("should not log messages with log level Off", () => {
    logger = new Logger(LogLevel.Off);

    logger.log("Info message", LogLevel.Info);
    logger.log("Debug message", LogLevel.Debug);

    expect(consoleLogSpy).to.not.have.been.called;
  });

  it("should log only messages with log level Info and above", () => {
    logger = new Logger(LogLevel.Info);

    logger.log("Info message", LogLevel.Info);
    logger.log("Debug message", LogLevel.Debug);

    expect(consoleLogSpy).to.have.been.calledWith(
      "search-integrator [Info]: Info message"
    );
    expect(consoleLogSpy).to.not.have.been.calledWith(
      "search-integrator [Debug]: Debug message"
    );
  });
});
