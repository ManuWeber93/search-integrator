import fs from "fs";
import {
  IHtmlComponentIntegration,
  IScriptIntegration,
  IStylesheetIntegration,
} from "../../models/IntegratorModels";
import * as FileHandler from "../../utils/FileHandler.js";
import { HTMLElement, parse } from "node-html-parser";
import DefaultConfig from "../../DefaultConfig.js";
import { concatDefaultAndConfigLists } from "../../utils/HelperFunctions.js";
import path from "path";
import {
  IInputDirectory,
  ISearchIntegratorConfig,
} from "../../models/SearchIntegratorModels";

class Integrator {
  private readonly config: ISearchIntegratorConfig;
  private readonly inputDirectories: IInputDirectory[];
  private readonly inputFileExtensions: string[];
  private readonly htmlComponentsToIntegrate?: IHtmlComponentIntegration[];
  private readonly scriptsToIntegrate: IScriptIntegration[];
  private readonly stylesheetsToIntegrate?: IStylesheetIntegration[];

  constructor(config: ISearchIntegratorConfig) {
    this.config = config;

    this.inputFileExtensions = concatDefaultAndConfigLists(
        DefaultConfig.INTEGRATOR_INPUT_FILE_EXTENSIONS,
        this.config.inputFileExtensions
    );

    this.inputDirectories = this.config.inputDirectories;

    this.htmlComponentsToIntegrate =
        this.config.integratorConfig?.htmlComponentIntegrations;

    this.scriptsToIntegrate = concatDefaultAndConfigLists(
        [
          {
            pathToScript: `${this.config.outputBaseDirectory}/${DefaultConfig.INTEGRATOR_SCRIPT_INTEGRATIONS.pathToScript}`,
          },
        ],
        this.config.integratorConfig?.scriptIntegrations
    );

    this.stylesheetsToIntegrate =
        this.config.integratorConfig?.stylesheetIntegrations;
  }

  public runIntegrator(): void {
    this.inputDirectories.forEach((inputDirectory: IInputDirectory) => {
      const outputDirectoryName: string = `${this.config.outputBaseDirectory}/${
          inputDirectory.relativeOutputDirectory ?? ""
      }`;
      const filesOfDirectoryToBeEnriched = FileHandler.extractFiles(
          inputDirectory.inputDirectory,
          this.inputFileExtensions
      );

      this.integrateComponentsInFilesOfDirectory(
          filesOfDirectoryToBeEnriched,
          outputDirectoryName
      );
    });
  }

  private integrateComponentsInFilesOfDirectory(
      filesOfDirectoryToBeEnriched: string[],
      outputDirectoryName: string
  ) {
    filesOfDirectoryToBeEnriched.forEach((htmlFilePath: string): void => {
      const htmlFile: HTMLElement = this.createHTMLDocument(htmlFilePath);

      this.integrateHtmlComponents(htmlFile);
      this.integrateScripts(htmlFile, outputDirectoryName);
      this.integrateStylesheets(htmlFile, outputDirectoryName);

      FileHandler.saveHTMLToFile(
          htmlFile,
          outputDirectoryName,
          path.basename(htmlFilePath)
      );
    });
  }

  private createHTMLDocument(filePath: string): HTMLElement {
    const fileContents: string = fs.readFileSync(filePath, "utf-8");
    return parse(fileContents);
  }

  private integrateHtmlComponents(htmlFile: HTMLElement): void {
    if (!this.htmlComponentsToIntegrate) {
      return;
    }

    this.htmlComponentsToIntegrate.forEach(
        (htmlComponentIntegration: IHtmlComponentIntegration) => {
          const htmlComponent = fs.readFileSync(
              htmlComponentIntegration.pathToComponent,
              "utf-8"
          );
          this.integrateComponent(
              htmlFile,
              htmlComponent,
              htmlComponentIntegration.selector ??
              DefaultConfig.INTEGRATOR_HTML_COMPONENT_SELECTOR,
              htmlComponentIntegration.placement ??
              DefaultConfig.INTEGRATOR_HTML_COMPONENT_PLACEMENT
          );
        }
    );
  }

  private integrateScripts(
      htmlFile: HTMLElement,
      outputDirectoryName: string
  ): void {
    if (!this.scriptsToIntegrate) {
      return;
    }

    this.scriptsToIntegrate.forEach((scriptIntegration: IScriptIntegration) => {
      const scriptTag = this.createScriptTag(
          scriptIntegration.pathToScript,
          outputDirectoryName,
          scriptIntegration.module
      );
      this.integrateComponent(
          htmlFile,
          scriptTag,
          scriptIntegration.selector ?? DefaultConfig.INTEGRATOR_SCRIPT_SELECTOR,
          scriptIntegration.placement ?? DefaultConfig.INTEGRATOR_SCRIPT_PLACEMENT
      );
    });
  }

  private createScriptTag(
      pathToScript: string,
      outputDirectoryName: string,
      module?: boolean
  ): string {
    const relativePathToScript = path
        .relative(outputDirectoryName, pathToScript)
        .replace(/\\/g, "/");
    return `<script src="${relativePathToScript}" type="${
        module ? "module" : "text/javascript"
    }"></script>`;
  }

  private integrateStylesheets(
      htmlFile: HTMLElement,
      outputDirectoryName: string
  ): void {
    if (!this.stylesheetsToIntegrate) {
      return;
    }

    this.stylesheetsToIntegrate.forEach(
        (stylesheetIntegration: IStylesheetIntegration) => {
          const linkTag = this.createLinkTag(
              stylesheetIntegration.pathToStylesheet,
              outputDirectoryName
          );
          this.integrateComponent(
              htmlFile,
              linkTag,
              stylesheetIntegration.selector ??
              DefaultConfig.INTEGRATOR_STYLESHEET_SELECTOR,
              stylesheetIntegration.placement ??
              DefaultConfig.INTEGRATOR_STYLESHEET_PLACEMENT
          );
        }
    );
  }

  private createLinkTag(
      pathToStylesheet: string,
      outputDirectoryName: string
  ): string {
    const relativePathToStylesheet = path
        .relative(outputDirectoryName, pathToStylesheet)
        .replace(/\\/g, "/");
    return `<link rel="stylesheet" href="${relativePathToStylesheet}" />`;
  }

  private integrateComponent(
      htmlFile: HTMLElement,
      component: string,
      parentElementSelector: string,
      placement: InsertPosition
  ): void {
    const parentElement = this.getParentElement(
        htmlFile,
        parentElementSelector
    );
    parentElement.insertAdjacentHTML(placement, component);
  }

  private getParentElement(
      htmlFile: HTMLElement,
      selector: string
  ): HTMLElement {
    const parentElement: HTMLElement | null = htmlFile.querySelector(selector);

    if (!parentElement) {
      throw new ReferenceError(`No element found with selector ${selector}`);
    }
    return parentElement;
  }
}

export default Integrator;
