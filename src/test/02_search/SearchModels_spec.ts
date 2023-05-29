import { expect } from "chai";
import "mocha";
import { ISearchConfig } from "../../main/models/SearchModels";

let options: any = {
  includeScore: true,
  isCaseSensitive: true,
  includeMatches: true,
  minMatchCharLength: 3,
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  useExtendedSearch: false,
  findAllMatches: false,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  keys: [],
};
describe("ISearchConfig", () => {
  it("should have the correct properties", () => {
    const config: ISearchConfig = {
      searchIndexFilename: "search-index.json",
      maxNumbersOfReturnedSearchResults: 10,
      minScoreToBeConsideredInResultList: 0.5,
      searchOptions: options,
    };

    expect(config.searchIndexFilename).to.be.a("string");
    expect(config.maxNumbersOfReturnedSearchResults).to.be.a("number");
    expect(config.minScoreToBeConsideredInResultList).to.be.a("number");
    expect(config.searchOptions).to.be.an("object");
  });
});
