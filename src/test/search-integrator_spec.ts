import "mocha";
import {expect} from "chai";
import SearchIntegrator from "../main/search-integrator.js";
import {ISearchIntegratorConfig} from "../main/models/search-integrator-models";
import fs from "fs";
// import { after } from "mocha";
// import { deleteFolderRecursive } from "../main/utils/file-handler.js";


describe("SearchIntegrator", (): void => {
    const testInputDirectoryNotEmpty: string = "src/test/search-integrator-test/website";
    const testBaseUrl: string = ".";
    const testOutputDirectory: string = "src/test/search-integrator-test/output";

    // after( "delete output folder", () => deleteFolderRecursive(testOutputDirectory))

    describe("integrateSearch", (): void => {

        context("valid configuration without packing ", (): void => {
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
                packJsonInWebpackBundle: false,
                outputBaseDirectory: testOutputDirectory
            }

            const searchIntegrator: SearchIntegrator = new SearchIntegrator(config);

            it('should run through all the steps and create all files', async function() {
                await searchIntegrator.integrateSearch()
                expect(fs.existsSync(`${testOutputDirectory}/${config.parserConfig?.parserOutputFilename}`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/${config.searchConfig?.searchIndexFilename}`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/dist/search-integrator.js`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/test-page-one.html`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/test-page-two.html`)).to.be.true;
            }).timeout(30000);
        });

        context("valid configuration with packing ", (): void => {
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
                packJsonInWebpackBundle: true,
                outputBaseDirectory: testOutputDirectory
            }
            const searchIntegrator: SearchIntegrator = new SearchIntegrator(config);

            it('should run through all the steps', async () => {
                await searchIntegrator.integrateSearch();
                expect(fs.existsSync(`${testOutputDirectory}/${config.parserConfig?.parserOutputFilename}`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/${config.searchConfig?.searchIndexFilename}`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/dist/search-integrator.js`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/test-page-one.html`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/test-page-two.html`)).to.be.true;
            }).timeout(30000);
        })
    })
})
