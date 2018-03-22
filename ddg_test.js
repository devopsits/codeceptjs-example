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
