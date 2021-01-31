# ShopHer chrome extension
a chrome extension that supports women-owned businesses, integrated with [our web app](https://github.com/bhenriqu1/hackViolet_webApp)

## how it works
upon viewing a product on amazon, the extension will run a background script to make a call to the [rainforest api](https://www.rainforestapi.com/), gather product data to identify the category, then make a call to our [custom api](https://github.com/Hyma200/shopHer_API) to retrieve our stored women-owned business data. the script will then generate a list of suggestions that fall under the same category and display the results on the popup. implemented using [chrome's special-purpose api's](https://developer.chrome.com/docs/extensions/reference/) for browser, tabs, and storage.

# how to test it out:
1. go to `chrome://extensions/`
2. on the top right corner turn on `developer mode`
3. on the top left corner click `load unpacked`
4. select the directory where the extension's manifest file is stored 
5. now when you make changes, click the reload button on the bottom of the extension card
6. to see console logs, right-click extension icon and click `inspect popup`

# todo
- [x] add a loading spinner for the wait time to do the rainforest API call
- [x] get the extension to run without having to click the icon + have a notification on the icon once the suggestions are found
- [x] currently the suggestions go away if you close out of the popup -> instead have it stored until a new page is loaded

# inspiration
the [honey chrome extension](https://chrome.google.com/webstore/detail/honey/bmnlcjabgnpnenekpadlanbbkooimhnj?hl=en-US)
