
let blockList = [];
let commentElements = [];
let commentElementsReplyCount = [];


chrome.storage.local.get(["blocklist"], function (result) {
    blockList = result.blocklist;
});


function mainLoop() {
    let currentCommentElements = getComments();

    if (!elementsUpdated(commentElements, commentElementsReplyCount, currentCommentElements)) {
        return;
    }

    commentElements = [...currentCommentElements];
    commentElementsReplyCount = [];
  
    for (let i = 0; i < commentElements.length; i++) {
        commentElementsReplyCount.push(getCommentReplies(commentElements[i]).length);
        let username = getCommentUsername(commentElements[i]);

        addBlockButtonToComment(commentElements[i], onBlockUserClicked, username);

        if (blockList.includes(username)) {
            blockElement(commentElements[i], username);
        } else {
            let commentElementReplies = getCommentReplies(commentElements[i]);

            for (let j = 0; j < commentElementReplies.length; j++) { 
                username = getReplyUsername(commentElementReplies[j]);
                
                addBlockButtonToReply(commentElementReplies[j], onBlockUserClicked, username);

                if (blockList.includes(username)) {
                    blockElement(commentElementReplies[j], username);
                }
            }
        }
    }
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "block-user") {
        onBlockUserMessage(request.username);
    } else if (request.action === "unblock-user") {
        onUnblockUserMessage(request.username);
    } else if (request.action === "unblock-all") {
        onUnblockAllMessage();
    }
});


function onBlockUserMessage(username, updateStorage = false) {
    if (blockList.includes(username)) {
        return;
    }

    blockList.push(username);

    if (updateStorage) {
        chrome.storage.local.set({blocklist: blockList}, function () {});
    }

    for (let i = 0; i < commentElements.length; i++) {
        let commentUsername = getCommentUsername(commentElements[i]);

        if (commentUsername === username) {
            blockElement(commentElements[i], username);
        } else {
            let commentElementReplies = getCommentReplies(commentElements[i]);

            for (let j = 0; j < commentElementReplies.length; j++) { 
                let replyUsername = getReplyUsername(commentElementReplies[j]);

                if (replyUsername === username) {
                    blockElement(commentElementReplies[j], username);
                }
            }
        }
    }
}


function onBlockUserClicked(username) {
    onBlockUserMessage(username, true);

    let message = {
        action: "block-button-clicked",
        username: username
    };

    chrome.runtime.sendMessage(message);
}


function onUnblockUserMessage(username) {
    if (!blockList.includes(username)) {
        return;
    }

    blockList = blockList.filter(item => item !== username);
    unhideUserElements(username);
}


function onUnblockAllMessage() {
    for (let i = 0; i < blockList.length; i++) {
        unhideUserElements(blockList[i]);
    }

    blockList = [];
}


window.onload = function() {
    window.setInterval(function(){
        mainLoop();
    }, 100);
};
