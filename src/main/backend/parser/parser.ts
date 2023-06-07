import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { HTMLElement, parse } from "node-html-parser";
import { getJsonFileFromFS } from "../../utils/file-handler.js";

import {
  IRecord,
  IRecords,
  ISynonyms,
  IThesaurusApiResponse,
} from "../../models/parser-models";
import {
  concatDefaultAndConfigLists,
  fileNameContainsExcludedSubstring,
  removeDuplicatesAndFalsyValuesInArray,
  removeLinebreaksAndTrailingSpaces,
} from "../../utils/helper-functions.js";
import DefaultConfig from "../../default-config.js";
import {
  IInputDirectory,
  ISearchIntegratorConfig,
} from "../../models/search-integrator-models";

class Parser {
  private readonly config: ISearchIntegratorConfig;
  private readonly customSynonyms?: ISynonyms;
  private readonly inputDirectories: IInputDirectory[];
  private readonly inputFileExtensions: string[];
  private readonly parserOutput: IRecords;

  constructor(config: ISearchIntegratorConfig, customSynonyms?: ISynonyms) {
    this.config = config;
    this.inputDirectories = this.config.inputDirectories;
    this.inputFileExtensions = concatDefaultAndConfigLists(
      DefaultConfig.INTEGRATOR_INPUT_FILE_EXTENSIONS,
      this.config.inputFileExtensions
    );

    this.customSynonyms =
      customSynonyms ??
      (this.config.parserConfig?.synonymsFile
        ? getJsonFileFromFS(this.config.parserConfig.synonymsFile)
        : undefined);

    this.parserOutput = {
      recordsTotal: 0,
      records: [],
    };
  }

  public parseWebpages(): IRecords {
    this.inputDirectories.forEach((inputDirectory: IInputDirectory) => {
      const webpages: string[] = fs.readdirSync(inputDirectory.inputDirectory);
      if (!webpages || webpages.length === 0) {
        throw new Error(
          `Unable to scan input directory '${inputDirectory}'. No webpages found.`
        );
      }

      this.processFiles(
        webpages,
        inputDirectory.inputDirectory,
        inputDirectory.relativeOutputDirectory ?? ""
      );
    });

    return this.parserOutput;
  }

  // Used with free API Key (50'000 API calls/month). Terms of Service: https://api-ninjas.com/tos
  public async enrichRecordsWithSynonymsFromThesaurus(
    records: IRecords
  ): Promise<IRecords> {
    if (
      !this.config.parserConfig?.apiNinjasApiKey ||
      !records ||
      records.recordsTotal === 0
    ) {
      throw new ReferenceError(`Could not include synonyms from thesaurus.
        Please check that there is a valid API key in the configuration
        and that the records are not empty.`);
    }

    for (const record of records.records) {
      const searchTerms = [record.title, ...record.h1Headings];
      record.thesaurusSynonyms =
        await this.enrichSingleRecordWithSynonymsFromThesaurus(searchTerms);
    }

    return records;
  }

  private processFiles(
    files: string[],
    inputDirectory: string,
    relativeOutputDirectory: string
  ): void {
    let htmlFiles: string[] = this.filterInputFiles(files);

    for (const filename of htmlFiles) {
      const filePath: string = path.join(inputDirectory, filename);
      const htmlFile : string = fs.readFileSync(filePath, "utf-8");
      const root: HTMLElement = parse(htmlFile);
      this.createRecord(root, relativeOutputDirectory, filename);
    }
  }

  private filterInputFiles(files: string[]): string[] {
    return files.filter(
      (file: string) =>
        this.inputFileExtensions.includes(path.extname(file).toLowerCase()) &&
        !fileNameContainsExcludedSubstring(
          file,
          this.config.parserConfig?.ignoreFilesWithSubstring
        )
    );
  }

  private createRecord(
    root: HTMLElement,
    relativeOutputDirectory: string,
    link: string,
    containingPageOfSectionOrArticleId?: string
  ): void {
    this.removeIgnoredElements(root);

    const id = uuidv4();

    const h1Headings: string[] = this.getTextContentOfAllMatchingElements(
      root,
      "h1"
    );
    const otherHeadings: string[] = this.getTextContentOfAllMatchingElements(
      root,
      "h2, h3, h4, h5, h6"
    );
    const title: string =
      root.querySelector("title")?.textContent ??
      [...h1Headings, ...otherHeadings][0];
    const links: string[] = this.getTextContentOfAllMatchingElements(root, "a");
    const altTextOfImages: string[] =
      this.getAttributeValueOfAllMatchingElements(root, [["img", "alt"]]);
    const highlightedTexts: string[] = this.getTextContentOfAllMatchingElements(
      root,
      "strong, em, mark"
    );
    const metaDescription = removeDuplicatesAndFalsyValuesInArray(
      root
        .querySelectorAll("meta")
        .filter((element) => element.getAttribute("name") === "description")
        .map((element) => element.getAttribute("content"))
    );

    const additionalElementContent = this.extractAdditionalElementContent(
      root,
      this.config.parserConfig?.includedHtmlElementsSelectors
    );

    const additionalAttributeContent =
      this.getAttributeValueOfAllMatchingElements(
        root,
        this.config.parserConfig?.includedHtmlAttributeSelectors
      );

    const customSynonyms: string[] = this.getSynonymsFromFile([
      title,
      ...h1Headings,
    ]);

    let breadcrumbs;
    if (
      !containingPageOfSectionOrArticleId &&
      this.config.parserConfig?.parseSchemaOrgBreadcrumbList
    ) {
      breadcrumbs = this.parseSchemaOrgBreadcrumbList(root);
    }

    const relativeOutputDirectoryString = relativeOutputDirectory
      ? `${relativeOutputDirectory}/`
      : "";

    const resultObject: IRecord = {
      id,
      link: `${this.config.baseUrl}/${relativeOutputDirectoryString}${link}`,
      title,
      h1Headings,
      otherHeadings,
      links,
      altTextOfImages,
      highlightedTexts,
      metaDescription,
      additionalElementContent,
      additionalAttributeContent,
      customSynonyms,
      thesaurusSynonyms: [],
      containingPageOfSectionOrArticleId,
      breadcrumbs,
    };

    this.parserOutput.recordsTotal++;
    this.parserOutput.records.push(resultObject);

    if (
      this.config.parserConfig?.createRecordsForSectionsAndArticles &&
      !containingPageOfSectionOrArticleId
    ) {
      this.createRecordsForPartsOfWebpages(
        root,
        relativeOutputDirectory,
        link,
        id
      );
    }
  }

  private createRecordsForPartsOfWebpages(
    root: HTMLElement,
    relativeOutputDirectory: string,
    filename: string,
    containingElementId: string
  ) {
    this.extractPartsAndCreateRecords(
      root,
      relativeOutputDirectory,
      filename,
      "section",
      containingElementId
    );
    this.extractPartsAndCreateRecords(
      root,
      relativeOutputDirectory,
      filename,
      "article",
      containingElementId
    );
  }

  private extractPartsAndCreateRecords(
    root: HTMLElement,
    relativeOutputDirectory: string,
    filename: string,
    selector: string,
    containingElementId: string
  ) {
    const parts: HTMLElement[] = root
      .querySelectorAll(selector)
      .filter((part: HTMLElement) => part.getAttribute("id"));

    parts.forEach((part: HTMLElement) => {
      this.createRecord(
        part,
        relativeOutputDirectory,
        `${filename}#${part.getAttribute("id")}`,
        containingElementId
      );
    });
  }

  private removeIgnoredElements(root: HTMLElement): void {
    const elementsToBeRemoved = [
      DefaultConfig.PARSER_ELEMENTS_TO_IGNORE_SELECTOR,
      ...(this.config.parserConfig?.ignoredHtmlElementsSelectors ?? []),
    ];

    for (const selector of elementsToBeRemoved) {
      root.querySelectorAll(selector).forEach((element) => element.remove());
    }
  }

  private getTextContentOfAllMatchingElements(
    root: HTMLElement,
    querySelector: string
  ): string[] {
    return removeDuplicatesAndFalsyValuesInArray(
      removeLinebreaksAndTrailingSpaces(
        root
          .querySelectorAll(querySelector)
          .map((element: HTMLElement) => element.textContent)
      )
    );
  }

  private getAttributeValueOfAllMatchingElements(
    root: HTMLElement,
    attributeSelectors?: [[string, string]]
  ): string[] {
    if (!attributeSelectors) {
      return [];
    }

    let result: string[] = [];

    attributeSelectors.forEach((attributeSelector) => {
      const attributeValuesOfSelector = removeDuplicatesAndFalsyValuesInArray(
        root
          .querySelectorAll(attributeSelector[0])
          .map((element) => element.getAttribute(attributeSelector[1]))
      ).concat() as string[];
      result = [...result, ...attributeValuesOfSelector];
    });

    return result;
  }

  private extractAdditionalElementContent(
    root: HTMLElement,
    selectorList?: string[]
  ): string[] {
    const elementsToInclude = [
      DefaultConfig.PARSER_ELEMENTS_TO_INCLUDE_SELECTOR,
      ...(selectorList ?? []),
    ];

    return removeDuplicatesAndFalsyValuesInArray(
      elementsToInclude
        .map((selector) => {
          return this.getTextContentOfAllMatchingElements(root, selector);
        })
        .flat()
    );
  }

  private getSynonymsFromFile(searchTerms: string[]): string[] {
    if (!searchTerms || searchTerms.length === 0 || searchTerms.join() === "") {
      return [];
    }

    if (!this.customSynonyms) {
      return [];
    }

    let synonymsList: string[] = [];

    for (const searchTerm of searchTerms) {
      for (const synonymCollection of this.customSynonyms.synonymCollections) {
        let wordsOfInput = searchTerm.split(" ");
        if (wordsOfInput.some((word) => synonymCollection.includes(word))) {
          synonymsList.push(...synonymCollection);
        }
      }
    }

    return removeDuplicatesAndFalsyValuesInArray(synonymsList);
  }

  private async enrichSingleRecordWithSynonymsFromThesaurus(
    searchTerms: string[]
  ): Promise<string[]> {
    let synonymsList: string[] = [];

    for (const searchTerm of searchTerms) {
      const synonymResponse: Response = await fetch(
        `https://api.api-ninjas.com/v1/thesaurus?word=${searchTerm}`,
        {
          headers: { "X-Api-Key": this.config.parserConfig!.apiNinjasApiKey! },
        }
      );
      const responseResponseJson: IThesaurusApiResponse =
        await synonymResponse.json();
      synonymsList.push(...responseResponseJson.synonyms);
    }

    return removeDuplicatesAndFalsyValuesInArray(synonymsList);
  }

  private parseSchemaOrgBreadcrumbList(root: HTMLElement): string[] {
    const applicationLdJsonScripts: HTMLElement[] = root.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    if (applicationLdJsonScripts.length === 0) {
      return [];
    }

    const schemaOrgBreadcrumbLists = applicationLdJsonScripts
      .map((applicationLdJsonScript: HTMLElement) =>
        JSON.parse(applicationLdJsonScript.innerHTML)
      )
      .filter(
        (applicationLdJson) =>
          applicationLdJson["@type"] === "BreadcrumbList" &&
          applicationLdJson.itemListElement.length > 0
      );

    let breadcrumbs: string[] = [];
    for (const schemaOrgBreadcrumbList of schemaOrgBreadcrumbLists) {
      for (const breadcrumbItem of schemaOrgBreadcrumbList.itemListElement) {
        if (breadcrumbItem.name) {
          breadcrumbs.push(breadcrumbItem.name);
        }
      }
    }

    return breadcrumbs;
  }
}

export default Parser;
