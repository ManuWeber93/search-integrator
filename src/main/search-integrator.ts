import Parser from "./backend/parser/parser.js";
import * as FileHandler from "./utils/file-handler.js";
import {
  ISearchIntegrator,
  ISearchIntegratorConfig,
} from "./models/search-integrator-models";
import { IRecords } from "./models/parser-models";
import {
  ISearchFramework,
  ISearchIndex,
} from "./search/search-framework/models/i-search-framework";
import FuseSearch from "./search/search-framework/fuse-search.js";
import DefaultConfig from "./default-config.js";
import { Logger, LogLevel } from "./utils/logger.js";
import Integrator from "./backend/integrator/integrator.js";

import webpack, { Configuration, Stats } from "webpack";

import path from "path";
import { fileURLToPath } from "url";

class SearchIntegrator implements ISearchIntegrator {
  private readonly config: ISearchIntegratorConfig;
  private readonly parserOutputFilename: string;
  private readonly searchIndexFilename: string;
  private readonly webpackConfig: Configuration;

  constructor(config: ISearchIntegratorConfig) {
    this.config = config;

    this.parserOutputFilename =
      this.config.parserConfig?.parserOutputFilename ??
      DefaultConfig.PARSER_OUTPUT_FILENAME;
    this.searchIndexFilename =
      this.config.searchConfig?.searchIndexFilename ??
      DefaultConfig.SEARCH_INDEX_FILENAME;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.webpackConfig = {
      mode: "production",
      entry: [path.resolve(__dirname, "frontend", "search-processor.js")],
      output: {
        filename: "search-integrator.js",
        path: path.resolve(`${this.config.outputBaseDirectory}/dist`),
        libraryTarget: "var",
        library: "SearchProcessor",
      },
      plugins: [
        new webpack.DefinePlugin({
          searchIntegratorConfigPacked: JSON.stringify(this.config),
        }),
      ],
    };
  }

  public async integrateSearch(): Promise<void> {
    const logger: Logger = new Logger(this.config.logLevel);

    const records: IRecords = await this.parseWebsiteData();
    logger.log("Webpages successfully parsed.", LogLevel.Info);

    const index: ISearchIndex = this.createSearchIndex(records);
    logger.log("Search index successfully created.", LogLevel.Info);

    this.writeWebsiteDataAndSearchIndex(records, index);
    logger.log(
      "Website data and search index successfully written to outputDirectory.",
      LogLevel.Info
    );

    await this.buildWebpackBundle(records, index);
    logger.log("Webpack bundle successfully created", LogLevel.Info);

    this.runComponentIntegrator();
    logger.log("Components successfully integrated", LogLevel.Info);
  }

  private async parseWebsiteData(): Promise<IRecords> {
    const parser: Parser = new Parser(this.config);
    const records: IRecords = parser.parseWebpages();

    if (this.config.parserConfig?.includeThesaurusSynonyms) {
      await parser.enrichRecordsWithSynonymsFromThesaurus(records);
    }

    return records;
  }

  private createSearchIndex(records: IRecords): ISearchIndex {
    const keysOfRecords = Object.keys(records.records[0]);
    const searchFramework: ISearchFramework = new FuseSearch();
    return searchFramework.createIndex(keysOfRecords, records.records);
  }

  private writeWebsiteDataAndSearchIndex(
    records: IRecords,
    index: ISearchIndex
  ): void {
    FileHandler.createDirectoryIfNotPresentAndWriteJsonFile(
      this.config.outputBaseDirectory,
      this.parserOutputFilename,
      records
    );
    FileHandler.createDirectoryIfNotPresentAndWriteJsonFile(
      this.config.outputBaseDirectory,
      this.searchIndexFilename,
      index.toJSON()
    );
  }

  private buildWebpackBundle(
    records: IRecords,
    index: ISearchIndex
  ): Promise<void> {
    if (this.config.packJsonInWebpackBundle) {
      this.webpackConfig.plugins = this.webpackConfig.plugins || [];
      this.webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          parsedWebpagesPacked: JSON.stringify(records),
          searchIndexPacked: JSON.stringify(index),
        })
      );
    }

    return new Promise<void>((resolve) => {
      webpack(
        this.webpackConfig,
        (err: Error | undefined, stats: Stats | undefined) => {
          if (err || stats?.hasErrors()) {
            throw new Error(`Webpack bundle could not be created.
              Error: ${err}
              Stats: ${stats?.toString()}`);
          }
          resolve();
        }
      );
    });
  }

  private runComponentIntegrator(): void {
    const integrator = new Integrator(this.config);
    integrator.runIntegrator();
  }
}

export default SearchIntegrator;
