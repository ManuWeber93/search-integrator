import "mocha";
import { expect } from "chai";
import FuseSearch from "../../main/search/search_framework/FuseSearch.js";
import { IRecord } from "../../main/models/ParserModels";
import {
  ISearchIndex,
  ISearchInstance,
} from "../../main/search/search_framework/models/ISearchFramework";
import Fuse from "fuse.js";
import { v4 as uuidv4 } from "uuid";

/*
const data = {
    keysOfRecords: ["id", "title"],
    records: [{
        link: "test1",
        title: "test1",
        h1Headings: ["test1.1", "test1.2"],
        otherHeadings: [],
        importantKeywords: [],
        keywords: [],
        customSynonyms: [],
        thesaurusSynonyms: [],
    },
    {
        link: "test2",
        title: "test2",
        h1Headings: ["test2.1", "test2.2"],
        otherHeadings: [],
        importantKeywords: [],
        keywords: [],
        customSynonyms: [],
        thesaurusSynonyms: [],
    },
    ]
}
 */

describe("FuseSearch", () => {
  let search: FuseSearch;
  let keysOfRecords: string[] = [
    "link",
    "title",
    "h1Headings",
    "otherHeadings",
    "importantKeywords",
    "keywords",
    "customSynonyms",
    "thesaurusSynonyms",
  ];
  let records: IRecord[] = [
    {
      id: uuidv4(),
      link: "test1",
      title: "test1",
      h1Headings: ["test1.1", "test1.2"],
      otherHeadings: [],
      links: [],
      altTextOfImages: [],
      highlightedTexts: [],
      metaDescription: [],
      additionalElementContent: [],
      additionalAttributeContent: [],
      customSynonyms: [],
      thesaurusSynonyms: [],
    },
  ];

  let options: any = {
    includeScore: true,
    fieldNormWeight: 1,
    isCaseSensitive: true,
    includeMatches: true,
    minMatchCharLength: 3,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    useExtendedSearch: false,
    findAllMatches: false,
    ignoreLocation: false,
    ignoreFieldNorm: false,
    keys: [],
    sortFn: [Function],
    getFn: [Function],
  };

  let index: ISearchIndex;

  beforeEach(() => {
    search = new FuseSearch();
    keysOfRecords = ["field1", "field2"];
    index = search.createIndex(keysOfRecords, records);
  });

  describe("Function existence", () => {
    it("createIndex", () => {
      expect(search.createIndex).to.be.a("function");
    });
    it("parseIndex", () => {
      expect(search.parseIndex).to.be.a("function");
    });
    it("createSearchInstance", () => {
      expect(search.createSearchInstance).to.be.a("function");
    });
  });

  describe("createIndex", () => {
    it("should create an index with the given keys and records", () => {
      expect(
        JSON.stringify(search.createIndex(keysOfRecords, records))
      ).to.deep.equals(JSON.stringify(index));
    });
  });

  describe("parseIndex", () => {
    it("should parse the given index", () => {
      expect(JSON.stringify(search.parseIndex(index))).to.deep.equal(
        JSON.stringify(index)
      );
    });
  });

  describe("createSearchInstance", () => {
    it("should create a search instance with the given records, options, and index", () => {
      const instance: ISearchInstance = search.createSearchInstance(
        records,
        options,
        index
      );
      expect(instance).to.be.an.instanceOf(Fuse<IRecord>);
      expect(instance).to.have.property("options").that.deep.equals(options);
    });
  });
});
