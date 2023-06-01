import { expect } from "chai";
import fs from "fs";
import Integrator from "../../main/backend/02_integrator/Integrator.js";
import { ISearchIntegratorConfig } from "../../main/models/SearchIntegratorModels";
import path from "path";
import { afterEach } from "mocha";
import { HTMLElement, parse } from "node-html-parser";

describe("Integrator", () => {
  const testInputDirectory: string = "src/test/03_integrator/html-files";
  const testBaseUrl: string = ".";
  const testOutputDirectory: string = "src/test/03_integrator/output/";

  afterEach(() => {
    deleteFolderRecursive(testOutputDirectory);
  });

  describe("runIntegrator", () => {

    describe("Minimal Configurations", () => {
      context(
          "inputDirectory with one plain, outputBaseDirectory and baseUrl are given",
          () => {
            const config: ISearchIntegratorConfig = {
              inputDirectories: [
                {
                  inputDirectory: testInputDirectory,
                },
              ],
              baseUrl: testBaseUrl,
              outputBaseDirectory: testOutputDirectory,
            };

            const integrator = new Integrator(config);

            it("should create outputDirectory with html file in it", () => {
              integrator.runIntegrator();
              expect(fs.existsSync(config.outputBaseDirectory)).to.be.true;

              const isFileExists = fs.existsSync(
                  `${config.outputBaseDirectory}/test1.html`
              );
              expect(isFileExists).to.be.true;
            });
          }
      );

      context(
          "inputDirectory with one plain, outputBaseDirectory and baseUrl are given and relativeOutputDirectory",
          () => {
            const config: ISearchIntegratorConfig = {
              inputDirectories: [
                {
                  inputDirectory: testInputDirectory,
                  relativeOutputDirectory: "/html-files",
                },
              ],
              baseUrl: testBaseUrl,
              outputBaseDirectory: testOutputDirectory,
            };

            const integrator = new Integrator(config);

            it("should create outputDirectory which contains the relativeOutputDirectory stated in the config with html file in it", () => {
              integrator.runIntegrator();
              expect(fs.existsSync(config.outputBaseDirectory)).to.be.true;
              expect(
                  fs.existsSync(
                      `${config.outputBaseDirectory}/${config.inputDirectories[0].relativeOutputDirectory}`
                  )
              ).to.be.true;

              const isFileExists = fs.existsSync(
                  `${config.outputBaseDirectory}/${config.inputDirectories[0].relativeOutputDirectory}/test1.html`
              );
              expect(isFileExists).to.be.true;
            });
          }
      );

      context(
          "inputDirectory with more than one plain, outputBaseDirectory and baseUrl are given",
          () => {
            const config: ISearchIntegratorConfig = {
              inputDirectories: [
                {
                  inputDirectory: testInputDirectory,
                },
                {
                  inputDirectory: "src/test/03_integrator/html-files/Subfolder1",
                },
              ],
              baseUrl: testBaseUrl,
              outputBaseDirectory: testOutputDirectory,
            };

            const integrator = new Integrator(config);

            it("should create outputDirectory with all plains", () => {
              integrator.runIntegrator();
              expect(fs.existsSync(config.outputBaseDirectory)).to.be.true;
              expect(fs.existsSync(`${config.outputBaseDirectory}/Subfolder1`)).to
                  .be.false;
            });
          }
      );

      context(
          "inputDirectory with more than one plain, outputBaseDirectory and baseUrl are given and relativeOutputDirectory",
          () => {
            const config: ISearchIntegratorConfig = {
              inputDirectories: [
                {
                  inputDirectory: testInputDirectory,
                  relativeOutputDirectory: "/html-files",
                },
                {
                  inputDirectory: "src/test/03_integrator/html-files/Subfolder1",
                  relativeOutputDirectory: "/html-files/Subfolder1",
                },
              ],
              baseUrl: testBaseUrl,
              outputBaseDirectory: testOutputDirectory,
            };

            const integrator = new Integrator(config);

            it("should create outputDirectory with all plains which contains the relativeOutputDirectory stated in the config", () => {
              integrator.runIntegrator();
              expect(fs.existsSync(config.outputBaseDirectory)).to.be.true;
              expect(
                  fs.existsSync(
                      `${config.outputBaseDirectory}/${config.inputDirectories[0].relativeOutputDirectory}`
                  )
              ).to.be.true;
              expect(
                  fs.existsSync(
                      `${config.outputBaseDirectory}/${config.inputDirectories[1].relativeOutputDirectory}`
                  )
              ).to.be.true;
            });
          }
      );
    });

    describe("Integrator Configuration", () => {

      context("IHtmlComponentIntegration with pathToComponent", () => {
        const config: ISearchIntegratorConfig = {
          inputDirectories: [
            {
              inputDirectory: testInputDirectory,
            },
          ],
          baseUrl: testBaseUrl,
          outputBaseDirectory: testOutputDirectory,
          integratorConfig: {
            htmlComponentIntegrations: [
              {
                pathToComponent:
                    "./src/test/03_integrator/component-to-integrate/test-component.html",
              },
            ],
          },
        };

        const integrator = new Integrator(config);

        it("should check if an HTML file exists and contains the specified component", () => {
          integrator.runIntegrator();
          const directoryPath: string = "./src/test/03_integrator/output";
          const fileName: string = "test1.html";
          const filePath: string = path.join(directoryPath, fileName);

          const expectedHtmlComponent: string =
              '<div id="test-component"><h1>I am a test-component</h1></div>';

          expect(fs.existsSync(directoryPath)).to.be.true;
          expect(fs.existsSync(filePath)).to.be.true;

          const fileContent: string = fs.readFileSync(filePath, "utf8");
          const html: HTMLElement = parse(fileContent);
          const element: HTMLElement | null =
              html.querySelector("#test-component");

          expect(element).not.to.be.null;
          expect(element?.toString()).to.equal(expectedHtmlComponent);
        });
      });

      context("IHtmlComponentIntegration with pathToComponent and selector",() => {
            const config: ISearchIntegratorConfig = {
              inputDirectories: [
                {
                  inputDirectory: testInputDirectory,
                },
              ],
              baseUrl: testBaseUrl,
              outputBaseDirectory: testOutputDirectory,
              integratorConfig: {
                htmlComponentIntegrations: [
                  {
                    pathToComponent:
                        "./src/test/03_integrator/component-to-integrate/test-component.html",
                    selector: "#searchBar",
                  },
                ],
              },
            };

            const integrator = new Integrator(config);

            it("should check if an HTML file exists and contains the specified component at the correct selector", function () {
              integrator.runIntegrator();
              const directoryPath: string = testOutputDirectory;
              const fileName: string = `test1.html`;
              const filePath: string = path.join(directoryPath, fileName);

              const expectedHtmlComponent: string =
                  '<div id="test-component"><h1>I am a test-component</h1></div>';

              expect(fs.existsSync(directoryPath)).to.be.true;
              expect(fs.existsSync(filePath)).to.be.true;

              const fileContent: string = fs.readFileSync(filePath, "utf8");
              const html: HTMLElement = parse(fileContent);
              const element: HTMLElement | null = html.querySelector("#searchBar");

              expect(element).not.to.be.null;
              expect(element?.childNodes.toString()).to.equal(
                  expectedHtmlComponent.toString()
              );
            });
          });

      context("IHtmlComponentIntegration with pathToComponent and not valid selector",() => {
        const config: ISearchIntegratorConfig = {
          inputDirectories: [
            {
              inputDirectory: testInputDirectory,
            },
          ],
          baseUrl: testBaseUrl,
          outputBaseDirectory: testOutputDirectory,
          integratorConfig: {
            htmlComponentIntegrations: [
              {
                pathToComponent:
                    "./src/test/03_integrator/component-to-integrate/test-component.html",
                selector: "#notValid",
              },
            ],
          },
        };

        const integrator = new Integrator(config);

        it("should throw an error no selector found", function () {
          expect(() => integrator.runIntegrator()).to.throw(Error, `No element found with selector #notValid`)
        });
      });

      context("IScriptIntegration with pathToScript", () => {
        const config: ISearchIntegratorConfig = {
          inputDirectories: [
            {
              inputDirectory: testInputDirectory,
            },
          ],
          baseUrl: testBaseUrl,
          outputBaseDirectory: testOutputDirectory,
          integratorConfig: {
            scriptIntegrations: [
              {
                pathToScript: "./src/test/03_integrator/scripts-to-integrate/test-component.html",
              },
            ],
          },
        };

        const integrator = new Integrator(config);

        it("should contain script-tag with the specified source and correct type", () => {
          integrator.runIntegrator()
          const directoryPath: string = testOutputDirectory;
          const fileName: string = `test1.html`;
          const filePath: string = path.join(directoryPath, fileName);

          const expectedScriptTag: string =
              '<script src="../scripts-to-integrate/test-component.html" type="text/javascript"></script>';

          expect(fs.existsSync(directoryPath)).to.be.true;
          expect(fs.existsSync(filePath)).to.be.true;

          const fileContent: string = fs.readFileSync(filePath, "utf8");
          const html: HTMLElement = parse(fileContent);
          const scripts: HTMLElement[] | null = html.querySelectorAll('script');
          const lastScriptTag = scripts[scripts.length - 1];

          expect(scripts).not.to.be.null;
          expect(lastScriptTag.outerHTML).to.equal(expectedScriptTag);
        });
      });

      context("IScriptIntegration with pathToScript, selector and placement", () => {
        const config: ISearchIntegratorConfig = {
          inputDirectories: [
            {
              inputDirectory: testInputDirectory,
            },
          ],
          baseUrl: testBaseUrl,
          outputBaseDirectory: testOutputDirectory,
          integratorConfig: {
            scriptIntegrations: [
              {
                pathToScript: "./src/test/03_integrator/scripts-to-integrate/json-script.json",
                selector: "#scriptSelector",
                placement: "afterbegin"
              },
              {
                pathToScript: "./src/test/03_integrator/scripts-to-integrate/script.js",
                selector: "#scriptSelector",
                placement: "afterbegin"
              },
            ],
          },
        };

        const integrator = new Integrator(config);

        it("should contain two script-tags with the correct type at the correct position from the selector", () => {
          integrator.runIntegrator()
          const directoryPath: string = testOutputDirectory;
          const fileName: string = `test1.html`;
          const filePath: string = path.join(directoryPath, fileName);

          // TODO: Mit Manu besprechen, sollte bei JSON Script nicht type="application/json" stehen?

          const expectedScriptTags: string[] = [
                '<script src="../scripts-to-integrate/script.js" type="text/javascript"></script>',
                '<script src="../scripts-to-integrate/json-script.json" type="text/javascript"></script>'
          ]

          expect(fs.existsSync(directoryPath)).to.be.true;
          expect(fs.existsSync(filePath)).to.be.true;

          const fileContent: string = fs.readFileSync(filePath, "utf8");
          const html: HTMLElement = parse(fileContent);
          const scriptSelector: HTMLElement | null = html.querySelector('#scriptSelector');
          const scriptTagsInSelector = scriptSelector?.childNodes

          expect(scriptSelector).not.to.be.null;
          expect(scriptTagsInSelector).not.to.be.null;
          expect(scriptTagsInSelector?.length).to.equal(2);
          expect(scriptTagsInSelector?.toString()).to.eql(expectedScriptTags.toString());
        });
      });

      context("IScriptIntegration with pathToScript and module is true", () => {
        const config: ISearchIntegratorConfig = {
          inputDirectories: [
            {
              inputDirectory: testInputDirectory,
            },
          ],
          baseUrl: testBaseUrl,
          outputBaseDirectory: testOutputDirectory,
          integratorConfig: {
            scriptIntegrations: [
              {
                pathToScript: "./src/test/03_integrator/scripts-to-integrate/module-script.js",
                selector: "#scriptSelector",
                placement: "afterbegin",
                module: true
              }
            ],
          },
        };
        const integrator = new Integrator(config);

        it("should contain script tag for the module-script with type module", () => {
          integrator.runIntegrator()
          const directoryPath: string = testOutputDirectory;
          const fileName: string = `test1.html`;
          const filePath: string = path.join(directoryPath, fileName);

          // TODO: Mit Manu besprechen, sollte bei JSON Script nicht type="application/json" stehen?

          const expectedScriptTag: string =
            '<script src="../scripts-to-integrate/module-script.js" type="module"></script>';

          expect(fs.existsSync(directoryPath)).to.be.true;
          expect(fs.existsSync(filePath)).to.be.true;

          const fileContent: string = fs.readFileSync(filePath, "utf8");
          const html: HTMLElement = parse(fileContent);
          const scriptSelector: HTMLElement | null = html.querySelector('#scriptSelector');
          const scriptTagInSelector = scriptSelector?.childNodes

          expect(scriptSelector).not.to.be.null;
          expect(scriptTagInSelector).not.to.be.null;
          expect(scriptTagInSelector?.toString()).to.equal(
              expectedScriptTag
          );
        });
        });

      context("IStylesheetIntegration with pathToStylesheet",() => {
        const config: ISearchIntegratorConfig = {
          inputDirectories: [
            {
              inputDirectory: testInputDirectory,
            },
          ],
          baseUrl: testBaseUrl,
          outputBaseDirectory: testOutputDirectory,
          integratorConfig: {
            stylesheetIntegrations: [
              {
                pathToStylesheet: "./src/test/03_integrator/stylesheets-to-integrate/stylesheet.css",
              }
            ],
          },
        };

        const integrator = new Integrator(config);

        it("should contain link to the stylesheet in head of html-file", () => {
          integrator.runIntegrator();
          const directoryPath: string = testOutputDirectory;
          const fileName: string = `test1.html`;
          const filePath: string = path.join(directoryPath, fileName);

          /* TODO: Mit Manu besprechen:
          Node-html-parser erstellt link element nicht mit self closing /

          const expectedLinkTag: string =
              '<link rel="stylesheet" href="../stylesheets-to-integrate/stylesheet.css" />';
          */

          const expectedLinkTag: string =
              '<link rel="stylesheet" href="../stylesheets-to-integrate/stylesheet.css" >';

          expect(fs.existsSync(directoryPath)).to.be.true;
          expect(fs.existsSync(filePath)).to.be.true;

          const fileContent: string = fs.readFileSync(filePath, "utf8");
          const html: HTMLElement = parse(fileContent);
          const head = html.querySelector('head');
          const link = head?.querySelector('link');

          expect(link).not.to.be.null;
          expect(link?.toString()).to.equal(
              expectedLinkTag
          );
        });

      });

      context("IStylesheetIntegration with pathToStylesheet, selector and placement",() => {
        const config: ISearchIntegratorConfig = {
          inputDirectories: [
            {
              inputDirectory: testInputDirectory,
            },
          ],
          baseUrl: testBaseUrl,
          outputBaseDirectory: testOutputDirectory,
          integratorConfig: {
            stylesheetIntegrations: [
              {
                pathToStylesheet: "./src/test/03_integrator/stylesheets-to-integrate/stylesheet.css",
                selector: "#styleSelector",
                placement: "beforeend",
              }
            ],
          },
        };

        const integrator = new Integrator(config);

        it("should contain link to the stylesheet in selected element of html-file, beforeend", () => {
          integrator.runIntegrator()

          const directoryPath: string = testOutputDirectory;
          const fileName: string = `test1.html`;
          const filePath: string = path.join(directoryPath, fileName);

          /* TODO: Mit Manu besprechen:
          Node-html-parser erstellt link element nicht mit self closing /

          const expectedLinkTag: string =
              '<link rel="stylesheet" href="../stylesheets-to-integrate/stylesheet.css" />';
          */

          const expectedLinkTag: string =
              '<link rel="stylesheet" href="../stylesheets-to-integrate/stylesheet.css" >';

          expect(fs.existsSync(directoryPath)).to.be.true;
          expect(fs.existsSync(filePath)).to.be.true;

          const fileContent: string = fs.readFileSync(filePath, "utf8");
          const html: HTMLElement = parse(fileContent);
          const selector = html.querySelector('#styleSelector');
          const link = selector?.querySelector('link');

          expect(link).not.to.be.null;
          expect(link?.toString()).to.equal(
              expectedLinkTag
          );
        });
      });
    });
  });
});

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
