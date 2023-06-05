import "mocha";
import {expect} from "chai";
import SearchIntegrator from "../main/SearchIntegrator.js";
import {ISearchIntegratorConfig} from "../main/models/SearchIntegratorModels";
import fs from "fs";
import { after } from "mocha";
import { deleteFolderRecursive } from "../main/utils/FileHandler.js";


describe("SearchIntegrator", () => {
    const testInputDirectoryNotEmpty: string = "src/test/search-integrator-test/website";
    const testBaseUrl: string = ".";
    const testOutputDirectory: string = "src/test/search-integrator-test/output";

    after( "delete output folder", () => deleteFolderRecursive(testOutputDirectory))

    describe("integrateSearch", () => {

        context("valid configuration without packing ", () => {
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
                this.timeout(15000)
                await searchIntegrator.integrateSearch()
                expect(fs.existsSync(`${testOutputDirectory}/${config.parserConfig?.parserOutputFilename}`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/${config.searchConfig?.searchIndexFilename}`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/dist/search-integrator.js`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/test-page-one.html`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/test-page-two.html`)).to.be.true;
            });

        });

        context("valid configuration with packing ", () => {
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

            it('should run through all the steps', async function() {
                this.timeout(15000)
                await searchIntegrator.integrateSearch();
                expect(fs.existsSync(`${testOutputDirectory}/${config.parserConfig?.parserOutputFilename}`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/${config.searchConfig?.searchIndexFilename}`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/dist/search-integrator.js`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/test-page-one.html`)).to.be.true;
                expect(fs.existsSync(`${testOutputDirectory}/html-files/test-page-two.html`)).to.be.true;
            });

        })
    })
})
