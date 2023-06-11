import fs from "fs";
import { IHtmlComponentIntegration, IScriptIntegration, IStylesheetIntegration } from "../../models/integrator-models";
import * as FileHandler from "../../utils/file-handler.js";
import { HTMLElement, parse } from "node-html-parser";
import DefaultConfig from "../../default-config.js";
import { concatDefaultAndConfigLists } from "../../utils/helper-functions.js";
import path from "path";
import { IInputDirectory, ISearchIntegratorConfig } from "../../models/search-integrator-models";
import { Logger, LogLevel } from "../../utils/logger.js";

class Integrator {
  private readonly config: ISearchIntegratorConfig;
  private readonly inputDirectories: IInputDirectory[];
  private readonly inputFileExtensions: string[];
  private readonly htmlComponentsToIntegrate?: IHtmlComponentIntegration[];
  private readonly scriptsToIntegrate: IScriptIntegration[];
  private readonly stylesheetsToIntegrate?: IStylesheetIntegration[];
  private readonly logger: Logger;

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

    this.logger = Logger.getLogger(this.config.logLevel);
  }

  public runIntegrator(): void {
    this.inputDirectories.forEach((inputDirectory: IInputDirectory) => {
      this.logger.log(`Running integrator for directory '${inputDirectory.inputDirectory}'`, LogLevel.Debug);

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
      this.logger.log(`Running integrator for file ${path.basename(htmlFilePath)}`, LogLevel.Debug);

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
      this.logger.log(`No html components to integrate`, LogLevel.Debug);
      return;
    }

    this.htmlComponentsToIntegrate.forEach(
      (htmlComponentIntegration: IHtmlComponentIntegration) => {
        this.logger.log(`Integrating html component with path ${htmlComponentIntegration.pathToComponent}`, LogLevel.Debug);
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
        this.logger.log(`Integration of html component with path ${htmlComponentIntegration.pathToComponent} successful`, LogLevel.Debug);
      }
    );
  }

  private integrateScripts(
    htmlFile: HTMLElement,
    outputDirectoryName: string
  ): void {
    if (!this.scriptsToIntegrate) {
      this.logger.log(`No scripts to integrate`, LogLevel.Debug);
      return;
    }

    this.scriptsToIntegrate.forEach((scriptIntegration: IScriptIntegration) => {
      this.logger.log(`integrating script with path ${scriptIntegration.pathToScript}`, LogLevel.Debug);
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
      this.logger.log(`Integration of script with path ${scriptIntegration.pathToScript} successful`, LogLevel.Debug);
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
      this.logger.log(`No stylesheets to integrate`, LogLevel.Debug);
      return;
    }

    this.stylesheetsToIntegrate.forEach(
      (stylesheetIntegration: IStylesheetIntegration) => {
        this.logger.log(`Integrating stylesheet with path ${stylesheetIntegration.pathToStylesheet}`, LogLevel.Debug);
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
        this.logger.log(`Integration of stylesheet with path ${stylesheetIntegration.pathToStylesheet} successful`, LogLevel.Debug);
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
