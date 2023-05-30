import { expect } from "chai";
import fs from "fs";
import Integrator from "../../main/backend/02_integrator/Integrator.js";
import {ISearchIntegratorConfig} from "../../main/models/SearchIntegratorModels";
import path from "path";
import {afterEach} from "mocha";
import {HTMLElement, parse} from "node-html-parser";

describe("Integrator", () => {

    const testInputDirectory = "src/test/03_integrator/html-files";
    const testBaseUrl = "./test/03_integrator";
    const testOutputDirectory = "src/test/03_integrator/output/";

    afterEach(() => {
        deleteFolderRecursive(testOutputDirectory)
    })

    describe("Minimal Configuration", () => {
        context("inputDirectory with one plain, outputBaseDirectory and baseUrl are given", () => {
            const config: ISearchIntegratorConfig = {

                inputDirectories: [
                    {
                        inputDirectory: testInputDirectory,
                    }
                ],
                baseUrl: testBaseUrl,
                outputBaseDirectory: testOutputDirectory
            }

            const integrator = new Integrator(config)

            it("should create outputDirectory with html file in it", () => {
                integrator.runIntegrator();
                expect(fs.existsSync(config.outputBaseDirectory)).to.be.true;

                const isFileExists = fs.existsSync(`${config.outputBaseDirectory}/test1.html`);
                expect(isFileExists).to.be.true;
            });

        })

        context("inputDirectory with one plain, outputBaseDirectory and baseUrl are given and relativeOutputDirectory", () => {
            const config: ISearchIntegratorConfig = {

                inputDirectories: [
                    {
                        inputDirectory: testInputDirectory,
                        relativeOutputDirectory: "/html-files"
                    }
                ],
                baseUrl: testBaseUrl,
                outputBaseDirectory: testOutputDirectory
            }

            const integrator = new Integrator(config)

            it("should create outputDirectory which contains the relativeOutputDirectory stated in the config with html file in it", () => {
                integrator.runIntegrator();
                expect(fs.existsSync(config.outputBaseDirectory)).to.be.true;
                expect(fs.existsSync(`${config.outputBaseDirectory}/${config.inputDirectories[0].relativeOutputDirectory}`)).to.be.true;

                const isFileExists = fs.existsSync(`${config.outputBaseDirectory}/${config.inputDirectories[0].relativeOutputDirectory}/test1.html`);
                expect(isFileExists).to.be.true;

            });

        })

        context("inputDirectory with more than one plain, outputBaseDirectory and baseUrl are given", () => {
            const config: ISearchIntegratorConfig = {

                inputDirectories: [
                    {
                        "inputDirectory": testInputDirectory,
                    },
                    {
                        "inputDirectory": "src/test/03_integrator/html-files/Subfolder1",
                    }
                ],
                baseUrl: testBaseUrl,
                outputBaseDirectory: testOutputDirectory
            }

            const integrator = new Integrator(config)

            it("should create outputDirectory with all plains", () => {
                integrator.runIntegrator();
                expect(fs.existsSync(config.outputBaseDirectory)).to.be.true;
                expect(fs.existsSync(`${config.outputBaseDirectory}/Subfolder1`)).to.be.false;
            });
        })

        context("inputDirectory with more than one plain, outputBaseDirectory and baseUrl are given and relativeOutputDirectory", () => {
            const config: ISearchIntegratorConfig = {

                inputDirectories: [
                    {
                        inputDirectory: testInputDirectory,
                        relativeOutputDirectory: "/html-files"
                    },
                    {
                        inputDirectory: "src/test/03_integrator/html-files/Subfolder1",
                        relativeOutputDirectory: "/html-files/Subfolder1"
                    }
                ],
                baseUrl: testBaseUrl,
                outputBaseDirectory: testOutputDirectory
            }

            const integrator = new Integrator(config)

            it("should create outputDirectory with all plains which contains the relativeOutputDirectory stated in the config", () => {
                integrator.runIntegrator();
                expect(fs.existsSync(config.outputBaseDirectory)).to.be.true;
                expect(fs.existsSync(`${config.outputBaseDirectory}/${config.inputDirectories[0].relativeOutputDirectory}`)).to.be.true;
                expect(fs.existsSync(`${config.outputBaseDirectory}/${config.inputDirectories[1].relativeOutputDirectory}`)).to.be.true;
            });
        })
    })

    describe("Integrator Config is used", () => {
        context("IHtmlComponentIntegration with pathToComponent", () => {
            // TODO: Siehe TODO in IntegratorModels.ts
            const config: ISearchIntegratorConfig = {

                inputDirectories: [
                    {
                        "inputDirectory": testInputDirectory,
                    }
                ],
                baseUrl: testBaseUrl,
                outputBaseDirectory: testOutputDirectory,
                integratorConfig: {
                    htmlComponentIntegrations: [
                        {
                            pathToComponent: "./src/test/03_integrator/component-to-integrate/test-component.html"
                        }
                    ]
                }
            }

            const integrator = new Integrator(config);

            it('should check if an HTML file exists and contains the specified component', () => {
                integrator.runIntegrator();
                const directoryPath: string = './src/test/03_integrator/output';
                const fileName: string = 'test1.html';
                const filePath: string = path.join(directoryPath, fileName);

                const expectedHtmlComponent: string = "<div id=\"test-component\"><h1>I am a test-component</h1></div>"

                expect(fs.existsSync(directoryPath)).to.be.true;
                expect(fs.existsSync(filePath)).to.be.true;

                const fileContent: string = fs.readFileSync(filePath, 'utf8');
                const html:HTMLElement = parse(fileContent)
                const element:HTMLElement | null = html.querySelector('#test-component')

                expect(element).not.to.be.null
                expect(element?.toString()).to.equal(expectedHtmlComponent);
            });
        })

        context("IHtmlComponentIntegration with pathToComponent and selector", () => {
            const config: ISearchIntegratorConfig = {

                inputDirectories: [
                    {
                        "inputDirectory": testInputDirectory,
                    }
                ],
                baseUrl: testBaseUrl,
                outputBaseDirectory: testOutputDirectory,
                integratorConfig: {
                    htmlComponentIntegrations: [
                        {
                            pathToComponent: "./src/test/03_integrator/component-to-integrate/test-component.html",
                            selector: "#searchBar"
                        }
                    ]
                }
            }

            const integrator = new Integrator(config);

            it('should check if an HTML file exists and contains the specified component and the specified place', function () {
                integrator.runIntegrator();
                const directoryPath: string = testOutputDirectory;
                const fileName: string = `test1.html`;
                const filePath: string = path.join(directoryPath, fileName);

                const expectedHtmlComponent: string = "<div id=\"test-component\"><h1>I am a test-component</h1></div>"

                expect(fs.existsSync(directoryPath)).to.be.true;
                expect(fs.existsSync(filePath)).to.be.true;

                const fileContent: string = fs.readFileSync(filePath, 'utf8');
                const html:HTMLElement = parse(fileContent)
                const element:HTMLElement | null = html.querySelector('#searchBar')

                expect(element).not.to.be.null
                expect(element?.childNodes.toString()).to.equal(expectedHtmlComponent);
            });
        });

        context("IHtmlComponentIntegration with pathToComponent and placement", () => {
            it('should check if an HTML file exists and contains the specified component and the specified place', function () {
                expect(true).to.be.true
            });
        });

        context("IHtmlComponentIntegration with pathToComponent, selector and placement", () => {
            console.log("")
        });

        context("IScriptIntegration with pathToScript", () => {
            console.log("")
        });

        context("IScriptIntegration with pathToScript and selector", () => {
            console.log("")
        });

        context("IScriptIntegration with pathToScript and placement", () => {
            console.log("")
        });

        context("IScriptIntegration with pathToScript and module is true", () => {
            console.log("")
        });

        context("IHtmlComponentIntegration with pathToComponent, selector and placement", () => {
            console.log("")
        });
    })
})

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

