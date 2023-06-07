import { ISearchOptions } from "../search/search-framework/models/i-search-framework";

interface ISearchConfig {
  searchIndexFilename?: string;
  maxNumbersOfReturnedSearchResults?: number;
  minScoreToBeConsideredInResultList?: number;
  searchOptions?: ISearchOptions;
  maxNumberOfSearchResultsOnDesktop?: number;
  maxNumberOfSearchResultsOnMobile?: number;
}

export { ISearchConfig };
