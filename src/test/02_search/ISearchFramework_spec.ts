import { expect } from "chai";
import FuseSearch from "../../main/search/search_framework/FuseSearch.js";
import {
  ISearchFramework,
  ISearchIndex,
} from "../../main/search/search_framework/models/ISearchFramework";
import { IRecord } from "../../main/models/ParserModels";
import Fuse from "fuse.js";
import { v4 as uuidv4 } from "uuid";

describe("ISearchFramework", () => {
  let searchFramework: ISearchFramework;
  let keysOfRecords: string[];
  let records: IRecord[];
  let searchIndex: ISearchIndex;

  before(() => {
    searchFramework = new FuseSearch();
    keysOfRecords = ["title", "keywords"];
    records = [
      {
        id: uuidv4(),
        link: "https://example.com",
        title: "Example Title",
        h1Headings: ["Example H1"],
        otherHeadings: [],
        links: [],
        altTextOfImages: [],
        highlightedTexts: [],
        metaDescription: [],
        additionalElementContent: [],
        additionalAttributeContent: [],
        customSynonyms: ["sample"],
        thesaurusSynonyms: ["example", "test"],
      },
    ];
    searchIndex = searchFramework.createIndex(keysOfRecords, records);
  });

  describe("createIndex", () => {
    it("should contain the correct keys", () => {
      expect(searchIndex.toJSON().keys).to.deep.equals(
        Fuse.createIndex(keysOfRecords, records).toJSON().keys
      );
    });

    it("should contain the correct records", () => {
      expect(searchIndex.toJSON().records).to.deep.equals(
        Fuse.createIndex(keysOfRecords, records).toJSON().records
      );
    });
  });
});
