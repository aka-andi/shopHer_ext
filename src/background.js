import { apiKey as _apiKey} from '../config';
const API = "https://us-central1-shopher.cloudfunctions.net/api/users";

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.startsWith('https://www.amazon.com/')) {
        // grab the ASIN of the product on the Amazon page to make the API call
        let asin;
        var url = tab.url;
        var regex = RegExp("https://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
        let m = url.match(regex);
        if (m) {
            asin = m[4];
        }
        const productGET = `https://api.rainforestapi.com/request?api_key=${_apiKey}&type=product&amazon_domain=amazon.com&asin=${asin}`;

        function getRainforestData() {
            return new Promise((resolve, reject) => {
                fetch(productGET, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    response.json().then((data) => {
                        resolve(data);
                    });
                }).catch(error => {
                    console.log("Error fetching response: ", error);
                });
            })
        }

        if (asin) {
            console.log(`Getting Data...`);
            getRainforestData().then(data => {
                let category = data.product.categories[0].name;
                console.log(`Product Data || Name: ${data.product.title} Category: ${category}`);
                data.product.categories.forEach(function (c) {
                    console.log(c);
                });
                getBusinesses().then(storedData => {
                    storedData.forEach(function (b) {
                        console.log(`found stored ${b.username} with category: ${b.category}`);
                    });
    
                    let suggestions = [];
                    findSuggestions(category, storedData, suggestions);
    
                    // set the correct badge for the number of suggestions
                    if (suggestions.length == 0) {
                        chrome.browserAction.setBadgeText({ text: '' });
                    }
                    else {
                        chrome.browserAction.setBadgeText({ text: suggestions.length.toString() });
                        chrome.browserAction.setBadgeBackgroundColor({ color: 'green' });
                    }
    
                    // store data for popup to display
                    chrome.storage.sync.set({ 'suggestions': suggestions });
                    chrome.storage.sync.set({ 'category': category });
                });
            });
        }
    }
    else {
        chrome.browserAction.setBadgeText({ text: '' });
    }
});


// populate storedData
function getBusinesses() {
    console.log('getting businesses...');
    return new Promise((resolve, reject) => {
        fetch(API, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => {
            response.json().then((storedData) => {
                resolve(storedData);
            });
        }).catch(error => {
            console.log("Error fetching response: ", error);
        });
    })
}

// find businesses to suggest under the product's category
function findSuggestions(category, storedData, suggestions) {
    storedData.forEach(function (b) {
        if (b.category == category)
            suggestions.push(b);
    });
}

