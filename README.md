A framework to integrate an on-site-search on static websites.

# Installation
```
npm i search-integrator
```

# Quickstart
1. Install the search-integrator framework `npm i search-integrator`
2. Create a script for the integration of the search on your website:
```
import SearchIntegrator from "search-integrator/src/main/search-integrator.js";
import { ISearchIntegratorConfig } from "search-integrator/src/main/models/search-integrator-models";

const config: ISearchIntegratorConfig = {
  inputDirectories: [
    {
      inputDirectory: "./my-input-directory"
    }
  ],
  outputBaseDirectory: "./output",
  baseUrl: "https://www.mydomain.com",
  packJsonInWebpackBundle: true
}
const searchIntegrator: SearchIntegrator = new SearchIntegrator(config);
await searchIntegrator.integrateSearch();

```
The input directory is a path to the directory which contains the source HTML files, the output base directory is the path in which the output of the search-integrator-framework should be written to and the base url is the url of your website.
3. Run the script


# Usage

# Configuration

