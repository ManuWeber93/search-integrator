import SearchIntegrator from "../main/SearchIntegrator.js";
import {ISearchIntegratorConfig} from "../main/models/SearchIntegratorModels";
import {expect} from "chai";
import fs from "fs";
import path from "path";


describe("SearchIntegrator", () => {

    const testInputDirectoryNotEmpty: string = "src/test/search-integrator-test/website";
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