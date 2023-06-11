# search-integrator

A framework to integrate a clientside on-site-search on static websites.

## Installation

```
npm i search-integrator
```

## Quickstart

1. Install the search-integrator framework `npm i search-integrator`
2. Create a search-component for your website (HTML, JS & CSS)
    - The HTML contains the structure of the search component.
      Example: https://github.com/ManuWeber93/search-integrator-quickstart-example/blob/main/search-component.html
    - The JS contains the logic of the search component.
      Example: https://github.com/ManuWeber93/search-integrator-quickstart-example/blob/main/search-component.js
3. Create a build script to integrate the search to your website.
   Example: https://github.com/ManuWeber93/search-integrator-quickstart-example/blob/main/build-script.js
    - Details regarding the configuration can be found [here](#configuration).
4. Run the build-script. Your search-enriched website has written to the outputBaseDirectory.

An example application of the search-integrator can be found
here: https://github.com/ManuWeber93/search-integrator-quickstart-example.

## How it works

The search-integrator framework indexes your webpages and adds a search functionality to your website. Per default the
following HTML elements are indexed (according to best practices from SEO and semantic HTML):

- Heading elements (h1 - h6)
- Title element
- Links (anker elements)
- Alt text of images
- Semantically highlighted texts (strong, em, mark elements)
- Meta description (meta element with 'name=description')

Further elements to be indexed [can be configured](#configuration) via CSS selectors.

For the search itself the powerful, lightweight, fuzzy-search library Fuse.js (https://fusejs.io/) is used.

![conzept_english drawio](https://github.com/ManuWeber93/search-integrator/assets/91136383/4da5c185-49ed-438f-a49e-7654cbaea604)
The concept of the search-integrator framework is divided into to parts: The integration of the search into the
webpages (which happens on the server)
and the effective search based on a user's search query (which happens on the client).

### SearchIntegrator

The [SearchIntegrator](#searchintegrator) object is used in the build script of the website to integrate a search to the
website.
To create a SearchIntegrator instance a [ISearchIntegratorConfig object](#configuration) is needed.
The SearchIntegrator offers one public function 'integrateSearch' which does the following:

- It parses all webpages from the configured input directories, extracts all relevant information and saves them in a
  structured format (json).
- It then creates a search index data structure which is needed for a performant search. This data structure is saved as
  json.
- It builds a bundle which contains all information needed to perform a clientside search. The bundle is
  provided as library with the name 'SearchProcessor'.
- It links the SearchProcessor library into all webpages from the configured input directories. Furthermore, all
  configured HTML, script, and stylesheet components are integrated into the webpages.
- It saves the enriched webpages to the output directory

```typescript
interface ISearchIntegrator {
  integrateSearch: () => Promise<void>;
}
```

### SearchProcessor

The [SearchProcessor](#searchprocessor) library is used to execute the search on the client side. It is added to each
configured input
webpage and can thus be used from the integrated search component.
The SearchProcessor offers one public function 'search' which takes a search term and a callback function as input
arguments.
It then performs a search according to the provided search term and calls the callback function which takes as arguments
the searchResults as well as all records. The object which contains all records can be used to display further
information about the search results.

```typescript
interface ISearchProcessor {
  search: (
    searchTerm: string,
    processSearchResults: (
      results: ISearchResult[],
      parsedWebpages: IRecords
    ) => void
  ) => void;
}
```

## Configuration

The configuration object as well as the used types are structured into the following interfaces.

```typescript
interface ISearchIntegratorConfig {
  inputDirectories: IInputDirectory[];
  inputFileExtensions?: string[];
  outputBaseDirectory: string;
  baseUrl: string;
  packJsonInWebpackBundle?: boolean;
  logLevel?: LogLevel;
  parserConfig?: IParserConfig;
  searchConfig?: ISearchConfig;
  integratorConfig?: IIntegratorConfig;
}

interface IInputDirectory {
  inputDirectory: string;
  relativeOutputDirectory?: string;
}

enum LogLevel {
  Off = 0,
  Info = 1,
  Debug = 2,
  All = 3,
}

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

interface ISearchConfig {
  searchIndexFilename?: string;
  minScoreToBeConsideredInResultList?: number;
  searchOptions?: ISearchOptions;
  maxNumberOfSearchResultsOnDesktop?: number;
  maxNumberOfSearchResultsOnMobile?: number;
}

interface IIntegratorConfig {
  htmlComponentIntegrations?: IHtmlComponentIntegration[];
  scriptIntegrations?: IScriptIntegration[];
  stylesheetIntegrations?: IStylesheetIntegration[];
}

interface IHtmlComponentIntegration {
  pathToComponent: string;
  selector?: string;
  placement?: InsertPosition;
}

interface IScriptIntegration {
  pathToScript: string;
  selector?: string;
  placement?: InsertPosition;
  module?: boolean;
}

interface IStylesheetIntegration {
  pathToStylesheet: string;
  selector?: string;
  placement?: InsertPosition;
}
```

### Details

Almost all properties are optionally since there exists a meaningful default. Only properties denoted with an * are
mandatory.

**ISearchIntegratorConfig**

- inputDirectories (*): A list of input directories which contain the webpages of the website.
    - inputDirectory: Path to the input directory.
    - relativeOutputDirectory: Relative path within the 'outputBaseDirectory' to which the enriched webpages
      should be written to. Defaults to the 'outputBaseDirectory'.
- fileExtensions: Files with these extensions are going to be enriched with the search functionality.
  Defaults to [".html",".htm"].
- outputBaseDirectory (*): Path to which the generated files of the search-integrator framework should be written to.
- baseUrl (*): The base url which is used to generate the links to the records.
- packJsonInWebpackBundle: Whether the records and the search index should be integrated into the SearchProcessor
  library
  bundle or not. If set to false then these files are going to be fetched during the loading process of the first
  webpage and
  stored into the local storage of the web browser. Packing these files into the SearchProcessor library has a
  significant impact on the size of the SearchProcessor
  library.
- logLevel: Defines the log level. Defaults to 'LogLevel.Info'.

**IParserConfig**

- parserOutputFilename: Name of the output file of the parser which contains the extracted records. Defaults to '
  parsedWebpages.json'.
- ignoreFilesWithSubstring: Used to ignore input files in the input directories.
- createRecordsForSectionsAndArticles: If set to 'true' then a record is created for each section and article element on
  a webpage in addition to the records which are created for each webpage. A section or article element must have an '
  id' attribute
  otherwise it is ignored. This is necessary to be able to create a link to the section/article.
- synonymsFile: A file which contains a lists of words which should be considered as synonyms.
  See [Synonyms](#synonyms) for more details.
- includeThesaurusSynonyms: If set to true then the thesaurus API from API Ninjas (https://api-ninjas.com/api/thesaurus)
  is consulted regarding synonyms. If
  set to true then a 'apiNinjasApiKey' must be defined.
- apiNinjasApiKey: The API key for API Ninjas (https://api-ninjas.com/). Must be provided if 'includeThesaurusSynonyms'
  is set to true.
- ignoredHtmlElementsSelectors: A list of CSS selectors which define elements which are ignored for the search.
- includedHtmlElementsSelectors: A list of CSS selectors which define elements to be indexed
  in [addition to the default](#how-it-works).
- includedHtmlAttributeSelectors: A list of tuples which define attributes of html elements to be indexed.
  Syntax: ['<html-element-name>', '<attribute-name>'].
- parseSchemaOrgBreadcrumbList: If set to 'true' then the schema.org-BreadcrumbList (https://schema.org/BreadcrumbList)
  placed on the input webpages is parsed and therefore available during the display of the search results.

**ISearchConfig**

- searchIndexFilename: Name of the output file which contains the search index data structure. Defaults to '
  searchIndex.json'.
- minScoreToBeConsideredInResultList: Defines the threshold regarding the score a search result must achieve to be
  considered as match. Defaults to 0.001. See https://fusejs.io/api/options.html#includescore for more details.
- searchOptions: Can be used to override the default searchOptions for Fuse.js. See https://fusejs.io/api/options.html
  for details.
- maxNumberOfSearchResultsOnDesktop: Maximal number of returned search results on desktop devices. Defaults to 10.
- maxNumberOfSearchResultsOnMobile: Maximal number of returned search results on mobile devices. Defaults to 5.

**IIntegratorConfig**

- htmlComponentIntegrations: Used to integrate HTML components into the webpages. Example: The structure of the search
  component.
    - pathToComponent (*): Path to the HTML component to integrate.
    - selector: CSS selector for the parent element into which the component is placed. Defaults to 'body'.
    - placement: A string representing the position relative to the parent element.
      See https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML?retiredLocale=de (position) for
      details. Defaults to 'afterbegin'.
- scriptIntegrations: Used to integrate scripts (links) into the webpages. Example: The logic of the search component.
    - pathToScript (*): Path to the script to integrate.
    - selector: CSS selector for the parent element into which the script is placed. Defaults to 'body'.
    - placement: A string representing the position relative to the parent element.
      See https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML?retiredLocale=de (position) for
      details. Defaults to 'beforeend'.
    - module: If set to 'true' then the script is integrated as module.
- IStylesheetIntegration: Used to integrate stylesheets (links) into the webpages. Example: The styles of the search
  component.
    - pathToStylesheet (*): Path to the stylesheet to integrate.
    - selector: CSS selector for the parent element into which the stylesheet is placed. Defaults to 'head'.
    - placement: A string representing the position relative to the parent element.
      See https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML?retiredLocale=de (position) for
      details. Defaults to 'beforeend'.

## Records

The extracted information from the webpages is saved as Records. The records have the following structure.

```typescript
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
```

## Synonyms

Synonyms can be used to enable the search-integrator framework to find the desired search results even though a user
uses a search term which is not present on the webpage. Synonyms are defined in a separate JSON-file with the following
structure:

```typescript
interface ISynonyms {
  synonymCollections: string[][];
}
```
The strings in a list in the synonym collection are considered to be synonyms.

An example of a synonyms file can be found here: https://github.com/ManuWeber93/search-integrator-quickstart-example/blob/main/open-ui-synonyms.json

In addition to the possibility to define your own synonyms, the search-integrator framework can
be [configured](#configuration) (IParserConfig, includeThesaurusSynonyms & apiNinjasApiKey) to consult the Thesaurus API from API Ninjas (https://api-ninjas.com/api/thesaurus)
regarding synonyms.

