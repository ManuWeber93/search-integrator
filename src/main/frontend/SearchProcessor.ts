import {
  ISearchFramework,
  ISearchIndex,
  ISearchInstance,
  ISearchOptions,
  ISearchResult,
} from "../search/search_framework/models/ISearchFramework";

import { IRecords } from "../models/ParserModels";
import DefaultConfig from "../DefaultConfig.js";
import { ISearchIntegratorConfig } from "../models/SearchIntegratorModels";
import FuseSearch from "../search/search_framework/FuseSearch.js";

declare global {
  // These objects are available on the client since they are packed in the webpack bundle
  const searchIntegratorConfigPacked: ISearchIntegratorConfig;
  const parsedWebpagesPacked: IRecords;
  const searchIndexPacked: ISearchIndex;
}

let parsedWebpages: IRecords;
let searchIndex: ISearchIndex;
let searchInstance: ISearchInstance;

document.addEventListener("DOMContentLoaded", async () => {
  if (!searchIntegratorConfigPacked.packJsonInWebpackBundle) {
    await setupJsonFilesFetchVariant();
  } else {
    parsedWebpages = parsedWebpagesPacked;
    searchIndex = searchIndexPacked;
  }

  searchInstance = getSearchInstance(
    parsedWebpages,
    searchIndex,
    searchIntegratorConfigPacked.searchConfig?.searchOptions
  );
});

async function setupJsonFilesFetchVariant(): Promise<void> {
  if (
    !sessionStorage.getItem("parsedWebpages") ||
    !sessionStorage.getItem("searchIndex")
  ) {
    await loadAndSafeJsonFiles();
  }

  parsedWebpages = JSON.parse(sessionStorage.getItem("parsedWebpages")!);
  searchIndex = JSON.parse(sessionStorage.getItem("searchIndex")!);
}

async function loadAndSafeJsonFiles(): Promise<void> {
  const parsedWebpagesResponse = await fetch(
    `${searchIntegratorConfigPacked.baseUrl}/${
      searchIntegratorConfigPacked.parserConfig?.parserOutputFilename ??
      DefaultConfig.PARSER_OUTPUT_FILENAME
    }`
  );
  const parsedWebpages: IRecords = await parsedWebpagesResponse.json();
  sessionStorage.setItem("parsedWebpages", JSON.stringify(parsedWebpages));

  const searchIndexResponse = await fetch(
    `${searchIntegratorConfigPacked.baseUrl}/${
      searchIntegratorConfigPacked.searchConfig?.searchIndexFilename ??
      DefaultConfig.SEARCH_INDEX_FILENAME
    }`
  );
  const searchIndex: ISearchIndex = await searchIndexResponse.json();
  sessionStorage.setItem("searchIndex", JSON.stringify(searchIndex));
}

function getSearchInstance(
  parsedWebpages: IRecords,
  searchIndexJson: ISearchIndex,
  searchOptions?: ISearchOptions
): ISearchInstance {
  const searchFramework: ISearchFramework = new FuseSearch();
  const searchIndex: ISearchIndex = searchFramework.parseIndex(searchIndexJson);
  return searchFramework.createSearchInstance(
    parsedWebpages.records,
    searchOptions ?? (DefaultConfig.SEARCH_OPTIONS as ISearchOptions),
    searchIndex
  );
}

export function search(
  searchTerm: string,
  processSearchResults: (
    results: ISearchResult[],
    parsedWebpages: IRecords
  ) => void,
  maxSearchResultsDesktop?: number,
  maxSearchResultsMobile?: number
): void {
  const maxNumbersOfSearchResults: number =
    getMaxNumberOfSearchResultsDependingOnDeviceType(
      maxSearchResultsDesktop,
      maxSearchResultsMobile
    );

  let results: ISearchResult[] = searchInstance.search(searchTerm, {
    limit: maxNumbersOfSearchResults,
  });

  results = reduceResultsToBestHits(results);

  processSearchResults(results, parsedWebpages);
}

function getMaxNumberOfSearchResultsDependingOnDeviceType(
  maxSearchResultsDesktop?: number,
  maxSearchResultsMobile?: number
): number {
  const isOnMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  return isOnMobile
    ? maxSearchResultsMobile ??
        DefaultConfig.SEARCH_MAX_NUMBER_OF_SEARCH_RESULTS_ON_MOBILE
    : maxSearchResultsDesktop ??
        DefaultConfig.SEARCH_MAX_NUMBER_OF_SEARCH_RESULTS_ON_DESKTOP;
}

function reduceResultsToBestHits(
  searchResults: ISearchResult[]
): ISearchResult[] {
  const filteredSearchResults = searchResults.filter(
    (result) =>
      result.score &&
      result.score <
        (searchIntegratorConfigPacked.searchConfig
          ?.minScoreToBeConsideredInResultList ??
          DefaultConfig.SEARCH_MIN_SCORE_TO_BE_CONSIDERED_IN_RESULT_LIST)
  );

  if (filteredSearchResults.length === 0) {
    return searchResults.slice(0, 1);
  }

  return filteredSearchResults;
}
