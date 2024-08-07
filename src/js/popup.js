
let blockList = [];


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("block-user-form-button").onclick = blockUserClicked;
    document.getElementById("unblock-all-button").onclick = unblockAllClicked;
    document.getElementById("block-user-form-input").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            blockUserClicked();
        }
    });
    
    chrome.storage.local.get(["blocklist"], function (result) {
        blockList = result.blocklist;

        for (let i = 0; i < blockList.length; i++) {
            addUserToList(blockList[i]);
        }

        if (blockList.length === 0) {
            document.getElementById("block-list").appendChild(createBlockListPlaceHolder());
        }
    });
});


function addUserToList(username) {
    let elementString = `<div class='blocked-user-item' username="` + username + `">
                         <a class='blocked-user-username'>` + username + `</a>
                         <button class='blocked-user-unblock-button'>Unblock</button>
                         </div>`;
    let element = new DOMParser().parseFromString(elementString, "text/html").body.childNodes[0];
    document.getElementById("block-list").appendChild(element);

    element.children[1].addEventListener("click", function() {
        unblockUserClicked(username);
    });

    let placeholderElement = document.getElementById("block-list-placeholder");

    if (placeholderElement) {
        placeholderElement.remove();
    }
}


function removeUserFromList(username) {
    let blockListElement = document.getElementById("block-list");
    let userElement = blockListElement.querySelector(".blocked-user-item[username='" + username + "']");

    if (userElement) {
        userElement.remove();
    }

    if (blockListElement.children.length === 0) {
        blockListElement.appendChild(createBlockListPlaceHolder());
    }
}


function blockUserClicked() {
    let username = document.getElementById("block-user-form-input").value;
    document.getElementById("block-user-form-input").value = "";

    if (blockList.includes(username)) {
        return;
    }

    blockList.push(username);

    let message = {
        action: "block-user",
        username: username
    };

    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.sendMessage(tab.id, message, function(response) {
                if (!chrome.runtime.lastError) {
                    // Needed for extension not to show errors when sending
                    // to tabs that don't have the content script injected
                }
            });
        });
    });

    addUserToList(username);
    chrome.storage.local.set({blocklist: blockList}, function () {});
}


function unblockUserClicked(username) {
    let message = {
        action: "unblock-user",
        username: username
    };

    if (!blockList.includes(username)) {
        return;
    }

    blockList = blockList.filter(item => item !== username);

    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.sendMessage(tab.id, message, function(response) {
                if (!chrome.runtime.lastError) {
                    // Needed for extension not to show errors when sending
                    // to tabs that don't have the content script injected
                }
            });
        });
    });

    removeUserFromList(username);
    chrome.storage.local.set({blocklist: blockList}, function () {});
}


function unblockAllClicked() {
    if (!window.confirm("Are you sure you want to unblock every user?")) {
        return;
    }

    let message = {
        action: "unblock-all"
    };

    blockList = [];

    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.sendMessage(tab.id, message, function(response) {
                if (!chrome.runtime.lastError) {
                    // Needed for extension not to show errors when sending
                    // to tabs that don't have the content script injected
                }
            });
        });
    });

    let blockListElement = document.getElementById("block-list");
    blockListElement.replaceChildren();
    blockListElement.appendChild(createBlockListPlaceHolder());
    chrome.storage.local.set({blocklist: blockList}, function () {});
}


function createBlockListPlaceHolder() {
    let message = "No blocked users found.";
    let elementString = "<a id='block-list-placeholder'>" + message + "</a>";
    return new DOMParser().parseFromString(elementString, "text/html").body.childNodes[0];
}