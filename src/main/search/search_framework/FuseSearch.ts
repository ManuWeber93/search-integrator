import {
  ISearchFramework,
  ISearchIndex,
  ISearchInstance,
} from "./models/ISearchFramework";
import { IRecord } from "../../models/ParserModels";
import Fuse from "fuse.js";
import { ISearchOptions } from "./models/ISearchFramework";

class FuseSearch implements ISearchFramework {
  public createIndex(
    keysOfRecords: string[],
    records: IRecord[]
  ): ISearchIndex {
    return Fuse.createIndex(keysOfRecords, records);
  }

  public parseIndex(index: any): ISearchIndex {
    return Fuse.parseIndex(index);
  }

  public createSearchInstance(
    records: IRecord[],
    options: ISearchOptions,
    index: ISearchIndex
  ): ISearchInstance {
    return new Fuse(records, options, index);
  }
}

export default FuseSearch;
