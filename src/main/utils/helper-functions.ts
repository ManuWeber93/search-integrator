function removeDuplicatesAndFalsyValuesInArray<T>(inputArray: T[]): T[] {
  return [...new Set(inputArray)].filter(Boolean) as any[];
}

function removeLinebreaksAndTrailingSpaces(inputs: string[]): string[] {
  return inputs.map((element: string) =>
    element.replace(/(\r\n|\n|\r)/gm, "").trim()
  );
}

function fileNameContainsExcludedSubstring(
  inputString: string,
  stringsToIgnore?: string[]
): boolean {
  return stringsToIgnore
    ? stringsToIgnore.some((substring: string) =>
        inputString.includes(substring)
      )
    : false;
}

function concatDefaultAndConfigLists(
  defaultConfig: any[],
  userConfig?: any[]
): any[] {
  return removeDuplicatesAndFalsyValuesInArray(
    defaultConfig.concat(userConfig ?? [])
  );
}

export {
  removeDuplicatesAndFalsyValuesInArray,
  removeLinebreaksAndTrailingSpaces,
  fileNameContainsExcludedSubstring,
  concatDefaultAndConfigLists,
};
