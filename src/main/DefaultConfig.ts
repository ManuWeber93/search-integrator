import { ISearchOptions } from "./search/search_framework/models/ISearchFramework";
import { IScriptIntegration } from "./models/IntegratorModels";

class DefaultConfig {
  public static readonly PARSER_OUTPUT_FILENAME: string = "parsedWebpages.json";
  public static readonly PARSER_ELEMENTS_TO_IGNORE_SELECTOR =
    ".data-searchIntegrator-ignore";
  public static readonly PARSER_ELEMENTS_TO_INCLUDE_SELECTOR =
    ".data-searchIntegrator-include";

  public static readonly SEARCH_INDEX_FILENAME: string = "searchIndex.json";
  public static readonly SEARCH_MAX_NUMBERS_OF_RETURNED_RESULTS: number = 3;
  public static readonly SEARCH_MIN_SCORE_TO_BE_CONSIDERED_IN_RESULT_LIST: number = 0.001;
  public static readonly SEARCH_OPTIONS: ISearchOptions = {
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    includeMatches: false,
    findAllMatches: false,
    minMatchCharLength: 3,
    threshold: 0.4,
    ignoreLocation: true,
  } as ISearchOptions;
  public static readonly SEARCH_MAX_NUMBER_OF_SEARCH_RESULTS_ON_DESKTOP = 10;
  public static readonly SEARCH_MAX_NUMBER_OF_SEARCH_RESULTS_ON_MOBILE = 5;

  public static readonly INTEGRATOR_INPUT_FILE_EXTENSIONS: string[] = [
    ".html",
    ".htm",
  ];
  public static readonly INTEGRATOR_SCRIPT_INTEGRATIONS: IScriptIntegration = {
    pathToScript: "dist/search-integrator.js",
  };
  public static readonly INTEGRATOR_HTML_COMPONENT_SELECTOR = "body";
  public static readonly INTEGRATOR_HTML_COMPONENT_PLACEMENT = "afterbegin";
  public static readonly INTEGRATOR_SCRIPT_SELECTOR = "body";
  public static readonly INTEGRATOR_SCRIPT_PLACEMENT = "beforeend";
  public static readonly INTEGRATOR_STYLESHEET_SELECTOR = "head";
  public static readonly INTEGRATOR_STYLESHEET_PLACEMENT = "beforeend";
}

export default DefaultConfig;
