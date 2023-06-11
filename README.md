# search-integrator
A framework to integrate a clientside on-site-search on static websites.

## Installation
```
npm i search-integrator
```

## Quickstart
An example application of the search-integrator can be found here: https://github.com/ManuWeber93/search-integrator-quickstart-example
1. Install the search-integrator framework `npm i search-integrator`
2. Create a search-component for your website (HTML, JS & CSS)
   - The HTML contains the structure of the search component Example: https://github.com/ManuWeber93/search-integrator-quickstart-example/blob/main/search-component.html
   - The JS contains the logic of the search component. Example: https://github.com/ManuWeber93/search-integrator-quickstart-example/blob/main/search-component.js
3. Create a script to integrate the search to your website. Example: https://github.com/ManuWeber93/search-integrator-quickstart-example/blob/main/build-script.js
   - Details regarding the configuration can be found [here](##Configuration)
4. Run the build-script. Your search-enriched website has been placed into the outputBaseDirectory.

## Configuration

## How it works
### Concept
![conzept_english drawio](https://github.com/ManuWeber93/search-integrator/assets/91136383/4da5c185-49ed-438f-a49e-7654cbaea604)



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




