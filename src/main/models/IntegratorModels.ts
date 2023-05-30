interface IIntegratorConfig {
  // TODO: Wiso sind dies Listen? Kann man mehrere Suchkomponenten integrieren? macht dies Sinn?
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

export {
  IIntegratorConfig,
  IScriptIntegration,
  IHtmlComponentIntegration,
  IStylesheetIntegration,
};
