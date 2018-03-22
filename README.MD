# CodeceptJS + Nightmare testing

CodeceptJS is a testing framework for end-to-end testing with different helpers such as Webdriver, Protactor, Nightmare, and others.

For this use case we are using Nightmare for its compactness, speed and screenshot library that helps us seeing the test result with better accuracy in the time it takes to run the test scenarios (less wait for the helper to load and run) and give us a better understading of what areas are slowing down the website, as well as not performing the desired processes.

## 1. Prerequisites

Before installing or starting to use the testing framework you need to install the latest version of NodeJS: [https://nodejs.org/en/](https://nodejs.org/en/)

### 1.1 Yarn

To install CodeceptJS and helper it's recommended to do it with Yarn as NPM has some issues with permissions while installing global packages of the framework.

To install Yarn it can be downloaded [here](https://yarnpkg.com/en/) or running NPM:

```javascript
npm install -g yarn
```

## 2. Installation

The framework and helpers should be specified in the ```package.lock``` file in the test folder with the versions that the test were developed in to ensure compatibility.

```javascript
{
	"dependencies": {
    	"codeceptjs": "1.1.7",
    	"nightmare": "2.10.0",
    }
}
```
And install them using yarn:

```javascript
yarn install --no-lockfile
```


## 3. Initializing

To initialize the configuration:

```javascript
codeceptjs init
```

Where it asks us where the tests are located (and where the configuration file will be), which helper we want to use (in this case Nightmare), and where do the logs/screenshots/reports are going to be stored (the default option 'output' is fine).

Next it ask us if we want to extend the object with custom steps which we reply not to, and leave the localization in English. Afterwards a ```codeceptjs.json``` configuration file is created.

We still need to make a couple of changes to said configuration file, so we open it in our desired text editor and edit it:

```javascript
{
  "tests": "./*_test.js",
  "timeout": 10000,
  "output": "./output",
  "helpers": {
    "Nightmare": {
      "restart": false,
      "show": false,
      "keepBrowserState":true
    }
  },
  "include": {},
  "bootstrap": false,
  "mocha": {},
  "name": "tests"
}
```

The changes are mostly on the ***Nightmare*** section of the file, where we add the options *restart* and *show* as false, and the option *keepBrowserState* as true. Explanation:

* ***restart***: it tells the framework to restart or not the browser in between tests.
* ***show***: it tells the framework to show or not the testing in an ***electron*** window while it is running. If there is something to be debbuged and the developer/tester need to see each step as it happens (instead of taking screenshot during every stage) this option is recommended to be set to *true*.
* ***keepBrowserState***: when *restart* is set to false it tells the framework to do not delete the cache and cookies (such as logged in state) between tests, saving the state of the browser (last visited page) also where the next scenario is going to start off by default.

## 4. Test Creation

Each tests should test a 'feature', and in them have different scenarios (such as fail ones, wrong info, success, etc).

From this point each *TEST* is going to be referred as ***FEATURE***, which contains different ***SCENARIOS*** that test cases for that given *feature*.

In the first presented case the file performs a serch on the search engine DuckDuckGo:

```javascript
Feature('DuckDuckGo search testing');

Scenario('Perform a search.', (I) => {
  I.clearCookie();
  I.amOnPage('https://duckduckgo.com');
  I.see('The search engine that doesn\'t track you.');
  I.fillField('q', 'Github');
  I.click('//*[@id="search_button_homepage"]');
  I.see('https://github.com');
});
  ```

As seen above this framework is scenario driven, and every command is described as an action of a user visiting the site. All the commands are available to read in: [http://devdocs.io/codeceptjs-helpers-nightmare/](http://devdocs.io/codeceptjs-helpers-nightmare/)

An explanation on some of the commands of the presented case above:

* ***clearCookie***: as the *feature* above is going to be the first of all the features, it is just there to ensure that it starts with a clean state.
* ***see***: is there to ensure that after going to the url specified in *amOnPage* redirect us to the correct path, if it does not it will fail that scenario..

Below is the same feature with parametrized data:

```javascript

Feature('DuckDuckGo search testing');

let testData = new DataTable(['url', 'ic', 'term', 'ic2']); //
testData.add(['https://duckduckgo.com', 'The search engine that doesn\'t track you.', 'Github', 'https://github.com']);
testData.add(['https://duckduckgo.com', 'The search engine that doesn\'t track you.', 'Node.js', 'https://nodejs.org']);
testData.add(['https://duckduckgo.com', 'The search engine that doesn\'t track you.', 'Yarn', 'https://yarnpkg.com/lang/en/docs/install/']);
testData.add(['https://duckduckgo.com', 'The search engine that doesn\'t track you.', 'CodeceptJS', 'https://codecept.io']);

Data(testData).Scenario('Perform a search.', (I, current) => {
  I.clearCookie();
  I.amOnPage(current.url);
  I.see(current.ic);
  I.fillField('q', current.term);
  I.click('//*[@id="search_button_homepage"]');
  I.see(current.ic2);
  I.saveScreenshot('resultSearch.png',true);
  });
  ```

In the presented feature above we introduced the concept of data tables, this are used to aid on keeping the same commonly used info or data between scenarios. Or it could be used to run the same scenario multiple times with different data by creating more than one data set for a given data table.

Some explanation of newly introduces concepts and commands in the feature above:

* **Data(datatablename)** and **current**: The first one is to pass the data table(s) to the scenario, and the second one is the name which is going to be used to call the differente entries of the data table, such as *url* that in the scenarios is going to be called with *current.url*.
* **saveScreenshot**: this command is used to take a screenshot of the current page the scenario is at, it is helpful to see the ending state of the scenarios and particularly if we are running the features in a headless mode (not showing the browser). The screenshots are saved in the *output* directory.

## 5. Test Running

To run the features we need to be on the folder where our features and configuration file are, then run the next command:

```javascript
codeceptjs run
````
This will run all the features in that folder. By default it runs them in alphabetical order, that's why it's recommended to name the features by a preceding number, like ```01_ddg_test.js``` so we can make sure that the features run as we desire.

If it necessary to see every single step of the scenarios are running then we need to run the command:

```javascript
codeceptjs run --steps
```

If a specific feature needs to be run then the file should be specified as follows:

```javascript
codeceptjs run ddg_test.js
```
After the features are run the framework will show us the log with how many passed and failed scenarios it had.

