import { IRecord } from "../../../models/parser-models";
import Fuse from "fuse.js";

type ISearchIndex = Fuse.FuseIndex<IRecord>;
type ISearchInstance = Fuse<IRecord>;
type ISearchResult = Fuse.FuseResult<IRecord>;
type ISearchOptions = typeof Fuse.config;

interface ISearchFramework {
  createIndex(keysOfRecords: string[], records: IRecord[]): ISearchIndex;

  parseIndex(index: any): ISearchIndex;

  createSearchInstance(
    records: IRecord[],
    options: ISearchOptions,
    index: ISearchIndex
  ): ISearchInstance;
}

export {
  ISearchFramework,
  ISearchIndex,
  ISearchInstance,
  ISearchResult,
  ISearchOptions,
};
