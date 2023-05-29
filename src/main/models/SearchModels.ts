import { ISearchOptions } from "../search/search_framework/models/ISearchFramework";

interface ISearchConfig {
  searchIndexFilename?: string;
  maxNumbersOfReturnedSearchResults?: number;
  minScoreToBeConsideredInResultList?: number;
  searchOptions?: ISearchOptions;
  maxNumberOfSearchResultsOnDesktop?: number;
  maxNumberOfSearchResultsOnMobile?: number;
}

export { ISearchConfig };
