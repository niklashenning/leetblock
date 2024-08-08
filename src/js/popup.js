
let blockList = [];


// Add event listener for when the popup loads
document.addEventListener("DOMContentLoaded", function () {
    // Set onclick events for popup buttons
    document.getElementById("block-user-form-button").onclick = blockUserClicked;
    document.getElementById("unblock-all-button").onclick = unblockAllClicked;

    // Add event listener to fire the block functionality if enter is pressed in input
    document.getElementById("block-user-form-input").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            blockUserClicked();
        }
    });
    
    // Load block list from local storage
    chrome.storage.local.get(["blocklist"], function (result) {
        blockList = result.blocklist;

        // Add each blocked user to popup block list
        for (let i = 0; i < blockList.length; i++) {
            addUserToList(blockList[i]);
        }
        
        // If no blocked user is found, display a placeholder element
        if (blockList.length === 0) {
            document.getElementById("block-list").appendChild(createBlockListPlaceHolder());
        }
    });
});


// Helper function that creates a block list element and adds it to the popup
function addUserToList(username) {
    // Create element from string
    let elementString = `<div class='blocked-user-item' username="` + username + `">
                         <a class='blocked-user-username'>` + username + `</a>
                         <button class='blocked-user-unblock-button'>Unblock</button>
                         </div>`;
    let element = new DOMParser().parseFromString(elementString, "text/html").body.childNodes[0];
    document.getElementById("block-list").appendChild(element);

    element.children[1].addEventListener("click", function() {
        unblockUserClicked(username);
    });

    // Remove placeholder element if found
    let placeholderElement = document.getElementById("block-list-placeholder");

    if (placeholderElement) {
        placeholderElement.remove();
    }
}


// Helper method that removes a block list element from the popup
function removeUserFromList(username) {
    // Get element by username attribute and remove it
    let blockListElement = document.getElementById("block-list");
    let userElement = blockListElement.querySelector(".blocked-user-item[username='" + username + "']");

    if (userElement) {
        userElement.remove();
    }

    // Show placeholder element if no block list elements left
    if (blockListElement.children.length === 0) {
        blockListElement.appendChild(createBlockListPlaceHolder());
    }
}


// Handles the block button getting clicked by getting username input and blocking the user
function blockUserClicked() {
    // Get username and add it to block list
    let username = document.getElementById("block-user-form-input").value;
    document.getElementById("block-user-form-input").value = "";

    if (blockList.includes(username)) {
        return;
    }

    blockList.push(username);
    addUserToList(username);

    // Send block-user message to every tab with content script injected
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

    // Update local storage
    chrome.storage.local.set({blocklist: blockList}, function () {});
}


// Handles the unblock button being clicked by unblocking the user
function unblockUserClicked(username) {
    // Remove user from block list
    if (!blockList.includes(username)) {
        return;
    }

    blockList = blockList.filter(item => item !== username);
    removeUserFromList(username);

    // Send unblock-user message to every tab with content script injected
    let message = {
        action: "unblock-user",
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

    // Update local storage
    chrome.storage.local.set({blocklist: blockList}, function () {});
}


// Handles the unblock all button being clicked by unblocking every blocked user
function unblockAllClicked() {
    // Confirmation popup to prevent accidentally clicking the button
    if (!window.confirm("Are you sure you want to unblock every blocked user?")) {
        return;
    }

    // Clear block list and show placeholder element
    blockList = [];
    let blockListElement = document.getElementById("block-list");
    blockListElement.replaceChildren();
    blockListElement.appendChild(createBlockListPlaceHolder());

    // Send unblock-all message to every tab with content script injected
    let message = {
        action: "unblock-all"
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

    // Update local storage
    chrome.storage.local.set({blocklist: blockList}, function () {});
}


// Helper function that creates a block list placeholder element
function createBlockListPlaceHolder() {
    let message = "No blocked users found.";
    let elementString = "<a id='block-list-placeholder'>" + message + "</a>";
    return new DOMParser().parseFromString(elementString, "text/html").body.childNodes[0];
}