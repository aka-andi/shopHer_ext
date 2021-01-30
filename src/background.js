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
                
            });
        }
    }
    else {
        chrome.browserAction.setBadgeText({ text: '' });
    }
});