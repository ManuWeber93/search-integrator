// import { expect } from "chai";
// import fs from "fs";
// import SearchIntegrator from "../../main/01_Npm/SearchIntegrator.js";
// import {getJsonFileFromFS} from "../../main/03_utils/FileHandler.js";
describe("SearchIntegrator", () => {
  /*
  beforeEach(() => {
    const searchIntegrator = new SearchIntegrator(
      "C:/BA/sdx_search_code/src/main/02_Swisscom/config/parserConfig.json",
      "C:/BA/sdx_search_code/src/main/02_Swisscom/config/searchConfig.json"
    );
  });

  describe("integrateSearch()", () => {
    it("should successfully integrate search", async () => {
      // TODO: mit manu anschauen, was genau hat geändert? await searchIntegrator.integrateSearch();
      // --> Funktion wurde umbenannt in writeWebsiteDataAndIndex()

      // Assert that the search index file was created
      console.log(process.cwd());
      expect(
        fs.existsSync("C:/BA/sdx_search_code/src/main/02_Swisscom/generated/")
      ).to.be.true;
      expect(
        fs.existsSync(
          "C:/BA/sdx_search_code/src/main/02_Swisscom/generated/searchIndex.json"
        )
      ).to.be.true;
      expect(
        fs.existsSync(
          "C:/BA/sdx_search_code/src/main/02_Swisscom/generated/parsedWebpages.json"
        )
      ).to.be.true;
    });
  });
    describe("getSearchInstance()", () => {
      it("should return an instance of ISearchInstance", () => {
        const searchInstance = searchIntegrator.getSearchInstance();
        expect(searchInstance).to.be.a("object");
        expect(searchInstance).to.have.property("search").that.is.a("function");
      });
    });

      describe('search()', () => {
          it('should return an array of ISearchResult', () => {
              const searchInstance = searchIntegrator.getSearchInstance();
              const searchResults = searchIntegrator.search(searchInstance, 'test');
              expect(searchResults).to.be.an('array');
              expect(searchResults[0]).to.have.property('item').that.is.a('object');
              expect(searchResults[0]).to.have.property('refIndex').that.is.a('number');
              expect(searchResults[0]).to.have.property('score').that.is.a('number');
          });

          it('should filter good search results', () => {
              const SearchConfig = getJsonFileFromFS("src/main/02_Swisscom/config/searchConfig.json")
              const searchInstance = searchIntegrator.getSearchInstance();
              const searchResults = searchIntegrator.search(searchInstance, 'test');
              expect(searchResults.every(result => result.score! >= SearchConfig.minScoreToBeConsideredInResultList)).to.be.true;
          });
      });

   */
});
