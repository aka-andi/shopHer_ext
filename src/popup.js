
const ul = document.querySelector(".businesses");

function updatePopup() {
    chrome.storage.sync.get(['suggestions', 'category'], function (data) {
        document.querySelector(".category").textContent = data.category;
        appendSuggestions(data.suggestions);
        if (data.suggestions.length > 0) {
            document.getElementById('main').innerHTML = document.getElementById('results').innerHTML;
            data.suggestions.forEach(function (s) {
                document.getElementById(s.username).onclick = function () {
                    chrome.tabs.create({ url: s.website });
                };
            });
        }
        else {
            document.querySelector(".category2").textContent = data.category;
            document.getElementById('main').innerHTML = document.getElementById('none').innerHTML;
        }
    });
}
document.addEventListener('DOMContentLoaded', updatePopup);

// dynamically add new suggestions to the popup
function appendSuggestions(suggestions) {
    console.log(`appending ${suggestions.length}`)
    suggestions.forEach(function (s) {
        console.log(`found suggestion: ${s.username}`);
        var li = document.createElement("li");
        var img = document.createElement('img');
        img.src = (s.hasOwnProperty('imageUrl')) ? s.imageUrl : '../images/lotus.png';
        li.appendChild(img);
        var a = document.createElement('a');
        a.setAttribute("id", s.username);
        a.appendChild(document.createTextNode(s.username));
        a.title = s.username;
        a.href = s.website;
        li.appendChild(a);
        ul.appendChild(li);
    });
}

// allow user to open webapp in new tab
document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({ active: true, url: location });
            };
        })();
    }
});
