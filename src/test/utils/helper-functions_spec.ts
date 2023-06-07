import "mocha";

import { expect } from "chai";
import { removeDuplicatesAndFalsyValuesInArray } from "../../main/utils/helper-functions.js";

describe("HelperFunctions", () => {
  describe("removeDuplicatesInArray", () => {
    let numberArray: number[];
    let stringArray: string[];
    beforeEach(() => {
      numberArray = [1, 2, 3, 4];
      stringArray = ["1", "2", "3", "4"];
    });
    context("when having no duplicates", () => {
      it("should be equal to input array (string-array)", () => {
        expect(removeDuplicatesAndFalsyValuesInArray(stringArray)).to.eql(
          stringArray
        );
      });
      it("should be equal to input array (number-array)", () => {
        expect(removeDuplicatesAndFalsyValuesInArray(numberArray)).to.eql(
          numberArray
        );
      });
    });
    context("when having duplicates", () => {
      it("should remove one duplicate", () => {
        let modifiedArray = Array.of(...stringArray);
        modifiedArray.push("1");
        expect(removeDuplicatesAndFalsyValuesInArray(modifiedArray)).to.eql(
          stringArray
        );
      });
      it("should remove several duplicates", () => {
        let modifiedArray = Array.of(...stringArray);
        modifiedArray.push("1", "2", "3", "4");
        expect(removeDuplicatesAndFalsyValuesInArray(modifiedArray)).to.eql(
          stringArray
        );
      });
      it("should remove several duplicates of the same value", () => {
        let modifiedArray = Array.of(...stringArray);
        modifiedArray.push("1", "1", "1", "1");
        expect(removeDuplicatesAndFalsyValuesInArray(modifiedArray)).to.eql(
          stringArray
        );
      });
    });
  });
});
