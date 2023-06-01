import SearchIntegrator from "../main/SearchIntegrator.js";
import {ISearchIntegratorConfig} from "../main/models/SearchIntegratorModels";
// @ts-ignore
import {expect} from "chai";
import fs from "fs";
import path from "path";


describe("SearchIntegrator", () => {

    const testInputDirectoryNotEmpty: string = "src/test/search-integrator-test/website";
    const testInputDirectoryEmpty: string = "src/test/search-integrator-test/empty-website/";
    const testBaseUrl: string = ".";
    const testOutputDirectory: string = "src/test/search-integrator-test/output";

    /* TODO: after implementation throws error => fix
    after(() => {
        deleteFolderRecursive(testOutputDirectory);
    });
    */

    describe("integrateSearch", () => {
        describe("valid configuration without packing ", async () => {
            const config: ISearchIntegratorConfig = {
                baseUrl: testBaseUrl,
                parserConfig: {
                    parserOutputFilename: "records.json"
                },
                searchConfig: {
                    searchIndexFilename: "searchIndex.json"
                },
                inputDirectories: [
                    {
                        inputDirectory: testInputDirectoryNotEmpty,
                        relativeOutputDirectory: "/html-files"
                    }
                ],
                outputBaseDirectory: testOutputDirectory
            }
            const searchIntegrator: SearchIntegrator = new SearchIntegrator(config);

            await searchIntegrator.integrateSearch()

            it('should create Records', function () {
                expect(fs.existsSync(`${testOutputDirectory}/${config.parserConfig?.parserOutputFilename}`)).to.be.true;
            });

            it('should create SearchIndex', function () {
                expect(fs.existsSync(`${testOutputDirectory}/${config.searchConfig?.searchIndexFilename}`)).to.be.true;
            });

            it('should create Webpack Bundle', function () {
                expect(fs.existsSync(`${testOutputDirectory}/dist/search-integrator.js`)).to.be.true;
            });

            it('should create Integrate Components', function () {
                expect(fs.existsSync(`${testOutputDirectory}/html-files/`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/test-page-one.html`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/test-page-two.html`)).to.be.true;
            });
        })

        describe("Invalid Configuration", () => {
            const config:ISearchIntegratorConfig = {
                baseUrl: testBaseUrl,
                parserConfig: {
                    parserOutputFilename: "records.json"
                },
                searchConfig: {
                    searchIndexFilename: "searchIndex.json"
                },
                inputDirectories: [
                    {
                        inputDirectory: testInputDirectoryEmpty,
                        relativeOutputDirectory: "/html-files"
                    }
                ],
                outputBaseDirectory: testOutputDirectory
            }

            const searchIntegrator: SearchIntegrator = new SearchIntegrator(config);

            context("InputDirectory is empty", () => {
                // TODO: Mit Manu besprechen Fehlermeldung sollte lauten: Keine Records auf Webpages gefunden. => Relevant bei leeren HTML Files anderes wird in Parser abgedeckt (leeres input verzeichnis)

                it("should throw an error that input directory is empty", () => {
                    expect(() => {searchIntegrator.integrateSearch()}).to.throw(Error,"Websites could not be parsed. Please check that the input directory is not empty." )
                })
            })
        })
    })
})

// @ts-ignore
function deleteFolderRecursive(folderPath: string): void {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
}
/* describe("SearchIntegrator", () => {
    let searchIntegrator: SearchIntegrator;
  beforeEach(() => {
    searchIntegrator = new SearchIntegrator(
        {
            baseUrl: "",
            inputDirectories: [],
            outputBaseDirectory: ""
        }

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

});
*/
