import { LogLevel } from "../utils/Logger";
import { IParserConfig, IRecords } from "./ParserModels";
import { ISearchConfig } from "./SearchModels";
import { IIntegratorConfig } from "./IntegratorModels";
import { ISearchResult } from "../search/search_framework/models/ISearchFramework";

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
