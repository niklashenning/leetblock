
let blockList = [];
let discussionItems = [];
let discussionItemsRepliesCount = [];


chrome.storage.local.get(["blocklist"], function (result) {
    blockList = result.blocklist;
});


function mainLoop() {
    let currentDiscussionItems = getDiscussionItems();

    if (!discussionItemsUpdated(discussionItems, discussionItemsRepliesCount, currentDiscussionItems)) {
        return;
    }

    discussionItems = [...currentDiscussionItems];
    discussionItemsRepliesCount = [];
  
    for (let i = 0; i < discussionItems.length; i++) {
        discussionItemsRepliesCount.push(getDiscussionItemReplies(discussionItems[i]).length);
        let username = getDiscussionItemUsername(discussionItems[i]);

        if (blockList.includes(username)) {
            blockItem(discussionItems[i], username);
        } else {
            let discussionItemReplies = getDiscussionItemReplies(discussionItems[i]);

            for (let j = 0; j < discussionItemReplies.length; j++) { 
                username = getReplyUsername(discussionItemReplies[j]);

                if (blockList.includes(username)) {
                    blockItem(discussionItemReplies[j], username);
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
    } else if (request.action == "unblock-all") {
        onUnblockAll();
    }
});


function onBlockUser(username) {
    if (blockList.includes(username)) {
        return false;
    }

    blockList.push(username);
    chrome.storage.local.set({blocklist: blockList}, function () {});

    for (let i = 0; i < discussionItems.length; i++) {
        let discussionItemUsername = getDiscussionItemUsername(discussionItems[i]);

        if (discussionItemUsername === username) {
            blockItem(discussionItems[i], username);
        } else {
            let discussionItemReplies = getDiscussionItemReplies(discussionItems[i]);

            for (let j = 0; j < discussionItemReplies.length; j++) { 
                replyUsername = getReplyUsername(discussionItemReplies[j]);

                if (replyUsername === username) {
                    blockItem(discussionItemReplies[j], username);
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
    unhideUserItems(username);
    return true;
}


function onUnblockAll() {
    for (let i = 0; i < blockList.length; i++) {
        unhideUserItems(blockList[i]);
    }

    blockList = [];
    chrome.storage.local.set({blocklist: blockList}, function () {});
}


window.onload = function() {
    window.setInterval(function(){
        mainLoop();
    }, 100);
};
