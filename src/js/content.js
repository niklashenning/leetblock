
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

        addBlockButtonToComment(commentElements[i], onBlockUser, username);

        if (blockList.includes(username)) {
            blockElement(commentElements[i], username);
        } else {
            let commentElementReplies = getCommentReplies(commentElements[i]);

            for (let j = 0; j < commentElementReplies.length; j++) { 
                username = getReplyUsername(commentElementReplies[j]);
                
                addBlockButtonToReply(commentElementReplies[j], onBlockUser, username);

                if (blockList.includes(username)) {
                    blockElement(commentElementReplies[j], username);
                }
            }
        }
    }
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "block-user") {
        sendResponse(onBlockUser(request.username));
    } else if (request.action === "unblock-user") {
        sendResponse(onUnblockUser(request.username));
    } else if (request.action === "unblock-all") {
        onUnblockAll();
    }
});


function onBlockUser(username) {
    if (blockList.includes(username)) {
        return false;
    }

    blockList.push(username);
    chrome.storage.local.set({blocklist: blockList}, function () {});

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
    return true;
}


function onUnblockUser(username) {
    if (!blockList.includes(username)) {
        return false;
    }

    blockList = blockList.filter(item => item !== username);
    chrome.storage.local.set({blocklist: blockList}, function () {});
    unhideUserElements(username);
    return true;
}


function onUnblockAll() {
    for (let i = 0; i < blockList.length; i++) {
        unhideUserElements(blockList[i]);
    }

    blockList = [];
    chrome.storage.local.set({blocklist: blockList}, function () {});
}


window.onload = function() {
    window.setInterval(function(){
        mainLoop();
    }, 100);
};
