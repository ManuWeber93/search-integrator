# search-integrator
A framework to integrate a clientside on-site-search on static websites.

## Installation
```
npm i search-integrator
```

## Quickstart
1. Install the search-integrator framework `npm i search-integrator`
2. Create a search-component for your website (HTML, JS & CSS)
   - The HTML should contain the search input field. Example:
   ```
   // search-component.html
   <div id="searchComponent">
     <input placeholder="Search..." oninput="search(this.value)" id="searchInput">
     <div id="searchResultList"></div>
   </div>
   ```
   - The JS should contain the logic to display the search results. Example:
   ```
   // search-component.js
   const searchResultList = document.querySelector("#searchResultList");
   
   function search(searchTerm) {
     SearchProcessor.search(searchTerm, processSearchResults);
   }
   
   function processSearchResults(searchResults, allRecords) {
     if (searchResults.length === 0) {
       setNoResultsAsResultList();
       return;
     }
     setSearchResultsAsResultList(searchResults, allRecords);
   }
   
   function setNoResultsAsResultList() {
     searchResultList.textContent = "No search results found...";
   }
   
   function setSearchResultsAsResultList(searchResults, allRecords) {
     const searchResultListItems = searchResults.map(searchResult =>
       `<div>
         <a href="${searchResult.item.link}">
           <div>${searchResult.item.title}</div>
         </a>
       </div>
       `);
   
     searchResultList.innerHTML = searchResultListItems.join("");
   }
   
   window.search = search;
   ```
3. Create a script which integrates the search to on your website
   - inputDirectories: A list of paths to directories which contain the webpages of your website
   - outputBaseDirectory: The path to the directory to which the output files should be written
   - baseUrl: The base url of your website
   - Please make sure you use the 'import'-syntax, since the 'require'-syntax is not supported by the search-integrator framework
```
// build-script.js
import SearchIntegrator from "search-integrator/src/main/search-integrator.js";

const config = {
  inputDirectories: [
    {
      inputDirectory: "./my-input-directory"
    }
  ],
  outputBaseDirectory: "./output",
  baseUrl: "http://localhost:63342/searchIntegratorQuickstart/output",
  integratorConfig: {
    htmlComponentIntegrations: [
      {
        pathToComponent: "./search-component.html"
      }
    ],
    scriptIntegrations: [
      {
        pathToScript: "./search-component.js",
        module: true
      }
    ]
  }
}

const searchIntegrator = new SearchIntegrator(config);
await searchIntegrator.integrateSearch();
```
4. Run the build-script. Your search-enriched website has been placed into the outputBaseDirectory.

## How it works
### Concept

### API
#### SearchIntegrator
The SearchIntegrator object is used in the build script of the website to integrate a search to all webpages of a website.
To create a SearchIntegrator instance a [config file](#Configuration) is needed.
The SearchIntegrator offers one public function 'integrateSearch' which does the following:
- It parses all webpages from the configured input directories, extracts all relevant information and saves them in a structured format (json).
- It then creates a search index data structure which is needed for a performant search. This data structure is saved as json.
- It builds a bundle which contains all information needed to perform a search on the client side. The bundle is provided as library with the name 'SearchProcessor'.
- It integrates the SearchProcessor library and all configured HTML, script, and stylesheet-components into all webpages from the configured input directories. 
- It saves the enriched webpages to the output directory

#### SearchProcessor
The SearchProcessor library is used to execute the search on the client side. It is added to each configured input webpage and can thus be used from the search component.
The SearchProcessor offers one public function 'search' which takes a search term and a callback function as input arguments.
It then performs a search according to the provided search term and calls the callback function which takes as arguments the searchResults as well as all records (can be used to display further information to the search results). 

## Configuration



