import { IRecords, ISynonyms } from "../../main/models/ParserModels";
import Parser from "../../main/backend/01_parser/Parser.js";
import chai, { expect } from "chai";
import fs from "fs";
import chaiAsPromised from "chai-as-promised";
import { ISearchIntegratorConfig } from "../../main/models/SearchIntegratorModels";

chai.use(chaiAsPromised);

describe("Parser", () => {
  describe("parseWebpages", () => {
    context("minimalConfig", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
      };
      const parser = new Parser(config);
      const records: IRecords = parser.parseWebpages();

      it("should create a record for each page", () => {
        expect(records.recordsTotal).to.be.equal(
          fs.readdirSync(config.inputDirectories[0].inputDirectory).length
        );
      });

      it("should have a link", () => {
        expect(records.records[0].link).to.be.equal(
          `${config.baseUrl}/${
            fs.readdirSync(config.inputDirectories[0].inputDirectory)[0]
          }`
        );
      });

      it("should extract h1 entries", () => {
        expect(records.records[0].h1Headings.length).to.be.greaterThan(0);
      });

      it("should extract other headings", () => {
        expect(records.records[0].otherHeadings.length).to.be.greaterThan(0);
      });

      it("should extract links", () => {
        expect(records.records[0].links.length).to.be.greaterThan(0);
      });

      it("should extract alt texts of images", () => {
        expect(records.records[1].altTextOfImages.length).to.be.greaterThan(0);
      });

      it("should extract highlighted texts (strong, em, mark elements)", () => {
        expect(records.records[0].highlightedTexts.length).to.be.equal(3);
      });

      it("should extract meta description", () => {
        expect(records.records[1].metaDescription.length).to.be.greaterThan(0);
      });

      it("should extract elements which are marked important", () => {
        expect(records.records[0].additionalElementContent.length).to.be.equal(
          1
        );
      });

      it("should ignore elements which are marked to be ignored", () => {
        expect(records.records[0].links.length).to.be.equal(3);
      });
    });

    context("several input directories", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
          },
          {
            inputDirectory: "src/test/01_parser/input-webpages-2",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
      };
      const parser = new Parser(config);
      const records: IRecords = parser.parseWebpages();

      it("should parse files of all input directories", () => {
        expect(records.recordsTotal).to.be.equal(
          fs.readdirSync(config.inputDirectories[0].inputDirectory).length +
            fs.readdirSync(config.inputDirectories[1].inputDirectory).length
        );
      });
    });

    context("empty input directory", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/empty-directory",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
      };
      const parser = new Parser(config);

      it("should throw error if the input directory is empty", () => {
        expect(() => parser.parseWebpages()).to.throw(Error);
      });
    });

    context("non-existent input directory", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/nonexistent-directory",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
      };
      const parser = new Parser(config);

      it("should throw error if the input directory is nonexistent", () => {
        expect(() => parser.parseWebpages()).to.throw(Error);
      });
    });

    context("relative output directory for a input directory", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
            relativeOutputDirectory: "outputDirectory",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
      };
      const parser = new Parser(config);
      const records: IRecords = parser.parseWebpages();

      it("should create the link correctly", () => {
        expect(records.records[0].link).to.be.equal(
          `${config.baseUrl}/${
            config.inputDirectories[0].relativeOutputDirectory
          }/${fs.readdirSync(config.inputDirectories[0].inputDirectory)[0]}`
        );
      });
    });

    context("ignore files in input directory", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
        parserConfig: {
          ignoreFilesWithSubstring: ["getting_started"],
        },
      };
      const parser = new Parser(config);
      const records: IRecords = parser.parseWebpages();

      it("should ignore configured files", () => {
        expect(records.recordsTotal).to.be.equal(
          fs.readdirSync(config.inputDirectories[0].inputDirectory).length - 1
        );
      });
    });

    context("create records for sections and articles", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
        parserConfig: {
          createRecordsForSectionsAndArticles: true,
        },
      };
      const parser = new Parser(config);
      const records: IRecords = parser.parseWebpages();

      it("should create records for sections and articles", () => {
        expect(records.recordsTotal).to.be.equal(
          fs.readdirSync(config.inputDirectories[0].inputDirectory).length +
            4 +
            5
        );
      });

      it("is possible to navigate to the containing page of a section or article", () => {
        const sectionRecord = records.records.find(
          (record) => record.title === "Second Section"
        );
        const containingPageOfSectionRecord = records.records.find(
          (record) =>
            record.id === sectionRecord?.containingPageOfSectionOrArticleId
        );
        expect(containingPageOfSectionRecord?.title).to.be.equal(
          "Test Link to Sections and Articles"
        );
      });
    });

    context("include custom synonyms directly", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
      };
      const synonyms: ISynonyms = {
        synonymCollections: [
          [
            "Button",
            "Buttons",
            "Button group",
            "Button Groups",
            "Button Icons",
          ],
        ],
      };
      const parser = new Parser(config, synonyms);
      const records: IRecords = parser.parseWebpages();

      it("should find custom synonyms for records", () => {
        expect(records.records[1].customSynonyms.length).to.be.greaterThan(0);
      });
    });

    context("include custom synonyms over file", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
        parserConfig: {
          synonymsFile: "src/test/01_parser/openUiSynonyms.json",
        },
      };
      const parser = new Parser(config);
      const records: IRecords = parser.parseWebpages();

      it("should find custom synonyms for records", () => {
        expect(records.records[1].customSynonyms.length).to.be.greaterThan(0);
      });
    });

    context("ignore HTML elements", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
        parserConfig: {
          ignoredHtmlElementsSelectors: [".footer"],
        },
      };
      const parser = new Parser(config);
      const records: IRecords = parser.parseWebpages();

      it("should not retrieve information of ignored HTML elements", () => {
        expect(records.records[1].links).not.to.contain("Contact");
      });
    });

    context("include further HTML elements", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
        parserConfig: {
          includedHtmlElementsSelectors: ["span"],
        },
      };
      const parser = new Parser(config);
      const records: IRecords = parser.parseWebpages();

      it("should include text of further included HTML elements", () => {
        expect(records.records[0].additionalElementContent).to.contain(
          "This text is inside a span element."
        );
      });
    });

    context("include configured HTML attribute values", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
        parserConfig: {
          includedHtmlAttributeSelectors: [["sdx-tabs-item", "label"]],
        },
      };
      const parser = new Parser(config);
      const records: IRecords = parser.parseWebpages();

      it("should include configured attribute values of HTML elements", () => {
        expect(records.records[3].additionalAttributeContent).to.contain(
          "Angular"
        );
      });
    });

    context("parse breadcrumbList in schema.org format", () => {
      const config: ISearchIntegratorConfig = {
        inputDirectories: [
          {
            inputDirectory: "src/test/01_parser/input-webpages",
          },
        ],
        outputBaseDirectory: "./parsed-webpages",
        baseUrl: ".",
        parserConfig: {
          parseSchemaOrgBreadcrumbList: true,
        },
      };
      const parser = new Parser(config);
      const records: IRecords = parser.parseWebpages();

      it("should parse the breadcrumb list", () => {
        expect(records.records[3].breadcrumbs?.length).to.be.greaterThan(0);
      });
    });
  });

  describe("enrichRecordsWithSynonymsFromThesaurus", () => {
    context("include synonyms from thesaurus", () => {
      it("should throw error without API key", async () => {
        const config: ISearchIntegratorConfig = {
          inputDirectories: [
            {
              inputDirectory: "src/test/01_parser/input-webpages",
            },
          ],
          outputBaseDirectory: "./parsed-webpages",
          baseUrl: ".",
        };
        const parser = new Parser(config);
        const records: IRecords = parser.parseWebpages();

        await expect(
          parser.enrichRecordsWithSynonymsFromThesaurus(records)
        ).to.be.rejectedWith(ReferenceError);
      });

      // Test case should not run to often, since there is a limit of API requests with the free plan of API ninjas
      /* it("should extract synonyms if API key is present", async () => {
        const config: ISearchIntegratorConfig = {
          inputDirectories: [
            {
              inputDirectory: "src/test/01_parser/input-webpages"
            }
          ],
          outputBaseDirectory: "./parsed-webpages",
          baseUrl: ".",
          parserConfig: {
            apiNinjasApiKey: "EhzUqMuPmf+GS+tOfqKxCA==FGcLYgGK1B2q0f1E"
          }
        };
        const parser = new Parser(config);
        let records: IRecords = parser.parseWebpages();
        records = await parser.enrichRecordsWithSynonymsFromThesaurus(records);

        expect(records.records[1].thesaurusSynonyms.length).to.be.greaterThan(
          0
        );
      }).timeout(30000); */
    });
  });
});
