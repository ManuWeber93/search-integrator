import "mocha";
import { expect } from "chai";
import {
  writeJsonToFile,
  getJsonFileFromFS,
} from "../../main/utils/FileHandler.js";
import fs from "fs";

describe("FileHandler", () => {
  const path: string = "./testData.json";

  after(function () {
    fs.unlinkSync(path);
  });

  it("can write and read to file", () => {
    const testData = {
      items: ["a", "b", "c"],
      reason: "testcase read and write from file",
    };

    writeJsonToFile(path, testData);
    let readData = getJsonFileFromFS(path);

    expect(readData.items).to.eql(["a", "b", "c"]);
    expect(readData.reason).to.eql("testcase read and write from file");
  });

  it("throws error when trying to read not existing file", () => {
    const notExistingPath: string = "/YourNotThere";

    expect(function () {
      getJsonFileFromFS(notExistingPath);
    }).to.throw("File could not be read from disk");
  });
});
