
let blockList = [];
let commentElements = [];


// Load block list from local storage
chrome.storage.local.get(["blocklist"], function (result) {
    blockList = result.blocklist;
});


// Main loop that runs every 100ms
function mainLoop() {
    // Get current comment elements and check if anything has changed
    let currentCommentElements = getComments();
    
    if (!elementsUpdated(commentElements, currentCommentElements)) {
        return;
    }

    commentElements = [...currentCommentElements];

    // Loop through every comment element, show block button and block element if needed
    for (let i = 0; i < commentElements.length; i++) {
        let username = getCommentUsername(commentElements[i]);
        addBlockButtonToComment(commentElements[i], onBlockUserClicked, username);
        
        if (blockList.includes(username)) {
            blockElement(commentElements[i], username);
        }
    }
}


// Message listener that listenes to messages from the popup script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Block or unblock users depending on the action type
    if (request.action === "block-user") {
        onBlockUserMessage(request.username);
    } else if (request.action === "unblock-user") {
        onUnblockUserMessage(request.username);
    } else if (request.action === "unblock-all") {
        onUnblockAllMessage();
    }
});


// Handles block-user message by blocking all elements associated with given user
function onBlockUserMessage(username, updateStorage = false) {
    if (blockList.includes(username)) {
        return;
    }

    blockList.push(username);

    // Update storage if requested (needed for when block button is clicked on site instead of in popup)
    if (updateStorage) {
        chrome.storage.local.set({blocklist: blockList}, function () {});
    }

    // Loop through comment element and block comments and replies of this user
    for (let i = 0; i < commentElements.length; i++) {
        let commentUsername = getCommentUsername(commentElements[i]);

        if (commentUsername === username) {
            blockElement(commentElements[i], username);
        }
    }
}


// Handles injeced block user button being clicked
function onBlockUserClicked(username) {
    // Call above method and request updating storage
    onBlockUserMessage(username, true);

    // Send block-button-clicked message to background script which then sends
    // a block-user message to all tabs that have the content script injected
    let message = {
        action: "block-button-clicked",
        username: username
    };
    chrome.runtime.sendMessage(message);
}


// Handles unblock-user message by unblocking all elements associated with given user
function onUnblockUserMessage(username) {
    if (!blockList.includes(username)) {
        return;
    }

    blockList = blockList.filter(item => item !== username);
    unhideUserElements(username);
}


// Handles unblock-all message by unblocking all blocked elements
function onUnblockAllMessage() {
    for (let i = 0; i < blockList.length; i++) {
        unhideUserElements(blockList[i]);
    }

    blockList = [];
}


// Make the main loop get called every 100ms after window has loaded
window.onload = function() {
    window.setInterval(function(){
        mainLoop();
    }, 100);
};
