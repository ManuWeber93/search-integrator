import "mocha";
import { expect } from "chai";
import {
  writeJsonToFile,
  getJsonFileFromFS,
  createDirectoryIfNotPresent,
  extractFiles,
  saveHTMLToFile,
  createDirectoryIfNotPresentAndWriteJsonFile, deleteFolderRecursive
} from "../../main/utils/file-handler.js";
import fs from "fs";
import path from "path";
import { HTMLElement, parse } from "node-html-parser";

describe("FileHandler", (): void => {
  const validDirectory: string = "./src/test/utils/test-directory/existing";
  const invalidDirectory: string = "./notValid/test/utils/test-directory/existing";
  const content: string = "<div>Test</div>";
  const html: HTMLElement = parse(content);
  const fileName: string = "test.html";
  const testData = {
    items: ["a", "b", "c"],
    reason: "testcase read and write from file",
  };

  const pathToFile: string = "./testData.json";

  after(function (): void {
    fs.unlinkSync(pathToFile);
    deleteFolderRecursive("./notValid");
    deleteFolderRecursive("./src/test/utils/test-directory/notExisting")
  });

  context("writeJsonToFile", (): void => {
    it("should write to and read from file", () => {
      writeJsonToFile(pathToFile, testData);
      let readData = getJsonFileFromFS(pathToFile);

      expect(readData.items).to.eql(["a", "b", "c"]);
      expect(readData.reason).to.eql("testcase read and write from file");
    });

    it("should throw an error when the file cannot be written", (): void => {
      const invalidPath: string = "/path/to/nonexistent/directory/file.json";

      expect(() => writeJsonToFile(invalidPath, testData)).to.throw(
        Error,
        "File could not be written to the disk"
      );
    });
  });

  context("getJsonFromFile", () => {
    it("should return json from an existing file", function (): void {
      const existingFilePath: string =
        "./src/test/utils/test-directory/json-script.json";

      expect(getJsonFileFromFS(existingFilePath)).to.eql({
        test: "tralalalalala",
      });
    });

    it("should throw an error when trying to read not existing file", (): void => {
      const notExistingPath: string = "/YourNotThere";

      expect(function (): void {
        getJsonFileFromFS(notExistingPath);
      }).to.throw("File could not be read from disk");
    });
  });

  context("extractFiles", () => {
    it("should return an array of files when directory contains matching files", (): void => {
      const directoryPath: string = "src/test/utils/test-directory/notEmpty";
      const fileExtensions: string[] = [".txt", ".csv"];

      const expectedFiles: string[] = [
        path.join(directoryPath, "file1.txt"),
        path.join(directoryPath, "file2.csv"),
      ];

      const result: string[] = extractFiles(directoryPath, fileExtensions);
      expect(result).to.deep.equal(expectedFiles);
    });

    it("should return an empty array when directory contains no files", (): void => {
      const directoryPath: string = "src/test/utils/test-directory/existing-empty/";
      const fileExtensions: string [] = [".txt", ".csv"];
      const expectedFiles: string[] = [];

      createDirectoryIfNotPresent(directoryPath);
      const result: string[] = extractFiles(directoryPath, fileExtensions);
      expect(result).to.deep.equal(expectedFiles);
    });

    it("should throw an error when an error occurs during file extraction", (): void => {
      const directoryPath: string = "/path/to/nonexistent/directory";
      const fileExtensions: string[] = [".txt", ".csv"];

      expect((): void => {
        extractFiles(directoryPath, fileExtensions);
      }).to.throw(Error);
    });
  });

  context("saveHTMLToFile", (): void => {
    it("should save content to file", function (): void {
      saveHTMLToFile(html, validDirectory, fileName);
      const filePath: string = path.join(validDirectory, fileName);
      expect(fs.existsSync(validDirectory)).to.be.true;
      expect(fs.existsSync(filePath)).to.be.true;
      expect(fs.readFileSync(filePath).toString()).to.eql(content);
    });
  });

  context("createDirectoryIfNotPresentAndWriteJsonFile", (): void => {

    it("should create the directory and write the JSON file", (): void => {
      createDirectoryIfNotPresentAndWriteJsonFile(
        invalidDirectory,
        fileName,
        testData
      );

      expect(fs.existsSync(invalidDirectory)).to.be.true;
      expect(fs.existsSync(`${invalidDirectory}/${fileName}`)).to.be.true;
    });
  });

  context("createDirectoryIfNotPresent", (): void => {



    it("should create the directory if it does not exist", (): void => {
      const directoryPath: string = "./src/test/utils/test-directory/notExisting";
      createDirectoryIfNotPresent(directoryPath);
      expect(fs.existsSync(directoryPath)).to.be.true;
    });
  });
});
