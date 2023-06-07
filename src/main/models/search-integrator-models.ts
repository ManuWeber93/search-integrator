import { LogLevel } from "../utils/logger.js";
import { IParserConfig, IRecords } from "./parser-models";
import { ISearchConfig } from "./search-models";
import { IIntegratorConfig } from "./integrator-models";
import { ISearchResult } from "../search/search-framework/models/i-search-framework";

interface ISearchIntegratorConfig {
  inputDirectories: IInputDirectory[];
  inputFileExtensions?: string[];
  outputBaseDirectory: string;
  baseUrl: string;
  packJsonInWebpackBundle?: boolean;
  logLevel?: LogLevel;
  parserConfig?: IParserConfig;
  searchConfig?: ISearchConfig;
  integratorConfig?: IIntegratorConfig;
}

interface IInputDirectory {
  inputDirectory: string;
  relativeOutputDirectory?: string;
}

interface ISearchIntegrator {
  integrateSearch: () => Promise<void>;
}

interface ISearchProcessor {
  search: (
    searchTerm: string,
    processSearchResults: (
      results: ISearchResult[],
      parsedWebpages: IRecords
    ) => void,
    maxSearchResultsDesktop?: number,
    maxSearchResultsMobile?: number
  ) => void;
}

export {
  ISearchIntegratorConfig,
  IInputDirectory,
  ISearchIntegrator,
  ISearchProcessor,
};
