/*
import { expect } from "chai";
import fs from "fs";
import Integrator from "../../../main/01_Npm/backend/02_integrator/Integrator.js";
import { IIntegratorConfig } from "../../../main/01_Npm/backend/02_integrator/models/IntegratorModels";
import path from "path";
import { JSDOM } from "jsdom";

describe("Integrator", () => {
  let testConfig: IIntegratorConfig;

  afterEach(() => {
    const outputDirectory = testConfig.outputDirectory;
    fs.readdirSync(outputDirectory).forEach((file) => {
      fs.unlinkSync(`${outputDirectory}/${file}`);
    });
  });

  it("should not run integration if both scriptIntegration and componentIntegration are false", () => {
    testConfig = {
      scriptIntegration: false,
      componentIntegration: false,
      targetDirectory: "src/test/01_Npm/03_integrator/HTMLFiles",
      scriptIntegrationConfig: {
        directoryScripts: "src/test/01_Npm/03_integrator/ScriptFiles",
        sourceScriptFileExtensions: [".js", ".cjs", "json"],
      },
      componentIntegrationConfig: {
        hookElementID: "searchBar",
        pathToComponentToIntegrate:
          "src/test/01_Npm/03_integrator/SearchComponentTest.html",
      },
      targetFileExtensions: [".html"],
      excludedFiles: [],
      outputDirectory: "src/test/01_Npm/03_integrator/output",
    };

    const integrator = new Integrator(testConfig);
    const originalFiles = fs.readdirSync(
      testConfig.targetDirectory
    );
    integrator.runIntegrator();
    const stillOriginalFiles = fs.readdirSync(
      testConfig.targetDirectory
    );
    const modifiedFiles = fs.readdirSync(testConfig.outputDirectory);

    expect(modifiedFiles).to.deep.equal([]);
    expect(originalFiles).to.deep.equal(stillOriginalFiles);
  });

  it("should run integration for HTML files if componentIntegration is true", () => {
    testConfig = {
      scriptIntegration: false,
      componentIntegration: true,
      targetDirectory: "src/test/01_Npm/03_integrator/HTMLFiles",
      scriptIntegrationConfig: {
        directoryScripts: "src/test/01_Npm/03_integrator/ScriptFiles",
        sourceScriptFileExtensions: [".js", ".cjs", "json"],
      },
      componentIntegrationConfig: {
        hookElementID: "searchBar",
        pathToComponentToIntegrate:
            "src/test/01_Npm/03_integrator/SearchComponentTest.html",
      },
      targetFileExtensions: [".html"],
      excludedFiles: [],
      outputDirectory: "src/test/01_Npm/03_integrator/output",
    };

/!*    const integrator = new Integrator(testConfig);

    integrator.runIntegrator();

    const originalFiles = readFiles(
      testConfig.componentIntegrationConfig.directoryHtmlFiles
    );
    const modifiedFiles = fs.readdirSync(testConfig.outputDirectory);
    const toBeIntegratedComopnent = fs.readFileSync(
      testConfig.componentIntegrationConfig.pathToComponentToIntegrate
    );
    console.log(originalFiles);
    console.log(modifiedFiles);

    expect(originalFiles.length).to.equal(modifiedFiles.length);
    modifiedFiles.forEach((file) => {
      let fileContents = fs
        .readFileSync(`${testConfig.outputDirectory}/${file}`)
        .toString();
      const dom = new JSDOM();
      let document = dom.window.document;
      document.documentElement.innerHTML = fileContents;

      const searchBar = document.querySelector(
        testConfig.componentIntegrationConfig.hookElementID
      );


      expect(searchBar).to.be.true;
      // @ts-ignore
      expect(searchBar.innerHTML).to.deep.equal(toBeIntegratedComopnent);
       *!/
    });
  });

  it("should run integration for script files if scriptIntegration is true", () => {
    testConfig = {
      scriptIntegration: true,
      componentIntegration: false,
      targetDirectory: "src/test/01_Npm/03_integrator/HTMLFiles",
      scriptIntegrationConfig: {
        directoryScripts: "src/test/01_Npm/03_integrator/ScriptFiles",
        sourceScriptFileExtensions: [".js", ".cjs", "json"],
      },
      componentIntegrationConfig: {
        hookElementID: "searchBar",
        pathToComponentToIntegrate:
            "src/test/01_Npm/03_integrator/SearchComponentTest.html",
      },
      targetFileExtensions: [".html"],
      excludedFiles: [],
      outputDirectory: "src/test/01_Npm/03_integrator/output",
    };

    const integrator = new Integrator(testConfig);

    integrator.runIntegrator();

    // TODO: Assert the expected changes to the HTML files
    // TODO: Assert that the corresponding files are created or modified
  });

  it("should run integration for both HTML and script files if both scriptIntegration and componentIntegration are true", () => {
    const testConfig = {
      scriptIntegration: true,
      componentIntegration: true,
      targetDirectory: "src/test/01_Npm/03_integrator/HTMLFiles",
      scriptIntegrationConfig: {
        directoryScripts: "src/test/01_Npm/03_integrator/ScriptFiles",
        sourceScriptFileExtensions: [".js", ".cjs", "json"],
      },
      componentIntegrationConfig: {
        hookElementID: "searchBar",
        pathToComponentToIntegrate:
            "src/test/01_Npm/03_integrator/SearchComponentTest.html",
      },
      targetFileExtensions: [".html"],
      excludedFiles: [],
      outputDirectory: "src/test/01_Npm/03_integrator/output",
    };

    const integrator = new Integrator(testConfig);

    integrator.runIntegrator();
    // TODO: Assert the expected changes to the HTML files
    // TODO: Assert that the corresponding files are created or modified
  });
});

function readFiles(dir: string): string[] {
  let files: string[] = [];
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const entryPath = path.join(dir, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      const subFiles = readFiles(entryPath);
      files = files.concat(subFiles);
    } else {
      files.push(path.basename(entryPath));
    }
  }

  return files;
}


const config: IIntegratorConfig = {
    "targetFileExtensions": [".html", ".htm"],
    "targetDirectory": "./test/HTMLFiles/",
    "scriptIntegrationConfig": {
        "directoryScripts": "./test/ScriptFiles/",
        "sourceScriptFileExtensions": [".js", ".cjs", ".json"]
    },
    "excludedFiles": [],
    "componentIntegrationConfig": {
        "hookElement": "#searchBar",
        "pathToComponentToIntegrate": "./test/SearchComponentTest.html"
    },
    "outputDirectory": "./test/output/"
}

const TestIntegrator = new Integrator(config);
TestIntegrator.runIntegrator();


*/
