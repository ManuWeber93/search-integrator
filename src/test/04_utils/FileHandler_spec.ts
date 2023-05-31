import "mocha";
import { expect } from "chai";
import {
  writeJsonToFile,
  getJsonFileFromFS,
  createDirectoryIfNotPresent,
  extractFiles,
  saveHTMLToFile,
  createDirectoryIfNotPresentAndWriteJsonFile,
} from "../../main/utils/FileHandler.js";
import fs from "fs";
import path from "path";
import { HTMLElement, parse } from "node-html-parser";

describe("FileHandler", () => {
  const validDirectory: string = "./src/test/04_utils/testDirectory/existing";
  const invalidDirectory: string =
    "./notValid/test/04_utils/testDirectory/existing";
  const content: string = "<div>Test</div>";
  const html: HTMLElement = parse(content);
  const fileName: string = "test.html";
  const testData = {
    items: ["a", "b", "c"],
    reason: "testcase read and write from file",
  };

  const pathToFile: string = "./testData.json";

  after(function () {
    fs.unlinkSync(pathToFile);
  });

  context("writeJsonToFile", () => {
    it("should write to and read from file", () => {
      writeJsonToFile(pathToFile, testData);
      let readData = getJsonFileFromFS(pathToFile);

      expect(readData.items).to.eql(["a", "b", "c"]);
      expect(readData.reason).to.eql("testcase read and write from file");
    });

    it("should throw an error when the file cannot be written", () => {
      const invalidPath: string = "/path/to/nonexistent/directory/file.json";

      expect(() => writeJsonToFile(invalidPath, testData)).to.throw(
        Error,
        "File could not be written to the disk"
      );
    });
  });

  context("getJsonFromFile", () => {
    it("should return json from an existing file", function () {
      const existingFilePath: string =
        "src/test/03_integrator/scripts-to-integrate/json-script.json";

      expect(getJsonFileFromFS(existingFilePath)).to.eql({
        test: "tralalalalala",
      });
    });

    it("should throw an error when trying to read not existing file", () => {
      const notExistingPath: string = "/YourNotThere";

      expect(function () {
        getJsonFileFromFS(notExistingPath);
      }).to.throw("File could not be read from disk");
    });
  });

  context("extractFiles", () => {
    it("should return an array of files when directory contains matching files", () => {
      const directoryPath = "src/test/04_utils/testDirectory/notEmpty";
      const fileExtensions = [".txt", ".csv"];

      const expectedFiles = [
        path.join(directoryPath, "file1.txt"),
        path.join(directoryPath, "file2.csv"),
      ];

      const result: string[] = extractFiles(directoryPath, fileExtensions);
      expect(result).to.deep.equal(expectedFiles);
    });

    it("should return an empty array when directory contains no files", () => {
      const directoryPath = "src/test/04_utils/testDirectory/empty";
      const fileExtensions = [".txt", ".csv"];

      fs.readdirSync = () => [];

      const expectedFiles: string[] = [];

      const result = extractFiles(directoryPath, fileExtensions);
      expect(result).to.deep.equal(expectedFiles);
    });

    it("should throw an error when an error occurs during file extraction", () => {
      const directoryPath = "/path/to/nonexistent/directory";
      const fileExtensions = [".txt", ".csv"];

      fs.readdirSync = () => {
        throw new Error("File system error");
      };

      expect(() => extractFiles(directoryPath, fileExtensions)).to.throw(
        Error,
        "Extraction Failed"
      );
    });
  });

  context("saveHTMLToFile", () => {
    it("should save content to file", function () {
      saveHTMLToFile(html, validDirectory, fileName);
      const filePath = path.join(validDirectory, fileName);
      expect(fs.existsSync(validDirectory)).to.be.true;
      expect(fs.existsSync(filePath)).to.be.true;
      expect(fs.readFileSync(filePath).toString()).to.eql(content);
    });

    /*
    TODO: siehe FileHandler Zeile 62
    it('should throw an error when directory path is invalid', function () {
      expect(() => saveHTMLToFile(html, invalidDirectory, fileName)).to.throw(
          Error,
          "HTML-File could not be saved"
      )
    });
     */
  });

  // TODO: Mit Manu besprechen, braucht es diese Funktion wirklich (reine Kosmetik?)
  context("createDirectoryIfNotPresentAndWriteJsonFile", () => {
    it("should create the directory and write the JSON file", () => {
      createDirectoryIfNotPresentAndWriteJsonFile(
        invalidDirectory,
        fileName,
        testData
      );

      expect(fs.existsSync(invalidDirectory)).to.be.true;
      expect(fs.existsSync(`${invalidDirectory}/${fileName}`)).to.be.true;
    });
  });

  context("createDirectoryIfNotPresent", () => {
    it("should create the directory if it does not exist", () => {
      const directoryPath = "./src/test/04_utils/testDirectory/notExisting";
      createDirectoryIfNotPresent(directoryPath);
      expect(fs.existsSync(directoryPath)).to.be.true;
    });
  });
});
