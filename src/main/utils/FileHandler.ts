import fs from "fs";
import * as process from "process";
import path from "path";
import { HTMLElement } from "node-html-parser";

function writeJsonToFile(path: string, jsonObject: any) {
  try {
    fs.writeFileSync(path, JSON.stringify(jsonObject));
  } catch (err) {
    throw new Error(
      `File could not be written to the disk, ${err}, cwd: ${process.cwd()}`
    );
  }
}

function getJsonFileFromFS(filePath: string) {
  try {
    let data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    throw new Error(
      `File could not be read from disk, ${err}, cwd: ${process.cwd()}`
    );
  }
}

function extractFiles(
  directoryPath: string,
  fileExtensions: string[]
): string[] {
  let files: string[] = [];
  try {
    const fileList:string[] = fs.readdirSync(directoryPath);
    for (const file of fileList) {
      const filePath:string = path.join(directoryPath, file);
      const fileStat:fs.Stats = fs.statSync(filePath);

      if (fileStat.isFile()) {
        const extension:string = path.extname(filePath).toLowerCase();

        if (fileExtensions.includes(extension)) {
          files.push(filePath);
        }
      }
    }
  } catch (err) {
    throw new Error(`Extraction Failed: cwd: ${process.cwd()}, err: ${err}`);
  }

  return files;
}

function saveHTMLToFile(
  htmlFile: HTMLElement,
  filePath: string,
  fileName: string
) {
    try {
     createDirectoryIfNotPresent(filePath);
      const outputPath = `${filePath}/${fileName}`;
      fs.writeFileSync(outputPath, htmlFile.toString(), "utf-8");
    } catch (err) {
      throw new Error(`HTML-File could not be saved: ${err} `);
  }
}

function createDirectoryIfNotPresentAndWriteJsonFile(
  directory: string,
  filename: string,
  jsonObject: any
) {
  createDirectoryIfNotPresent(directory);
  writeJsonToFile(`${directory}/${filename}`, jsonObject);
}

function createDirectoryIfNotPresent(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

export {
  saveHTMLToFile,
  extractFiles,
  writeJsonToFile,
  getJsonFileFromFS,
  createDirectoryIfNotPresentAndWriteJsonFile,
  createDirectoryIfNotPresent,
};
