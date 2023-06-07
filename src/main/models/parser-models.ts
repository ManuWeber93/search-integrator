interface IParserConfig {
  parserOutputFilename?: string;
  ignoreFilesWithSubstring?: string[];
  createRecordsForSectionsAndArticles?: boolean;
  synonymsFile?: string;
  includeThesaurusSynonyms?: boolean;
  apiNinjasApiKey?: string;
  ignoredHtmlElementsSelectors?: string[];
  includedHtmlElementsSelectors?: string[];
  includedHtmlAttributeSelectors?: [[string, string]];
  parseSchemaOrgBreadcrumbList?: boolean;
}

interface ISynonyms {
  synonymCollections: string[][];
}

interface IThesaurusApiResponse {
  word: string;
  synonyms: string[];
  antonyms: string[];
}

interface IRecords {
  recordsTotal: number;
  records: IRecord[];
}

interface IRecord {
  id: string;
  link: string;
  title: string;
  h1Headings: string[];
  otherHeadings: string[];
  links: string[];
  altTextOfImages: string[];
  highlightedTexts: string[];
  metaDescription: (string | undefined)[];
  additionalElementContent: string[];
  additionalAttributeContent: string[];
  customSynonyms: string[];
  thesaurusSynonyms: string[];
  containingPageOfSectionOrArticleId?: string;
  breadcrumbs?: string[];
}

export { IRecord, IRecords, ISynonyms, IThesaurusApiResponse, IParserConfig };
