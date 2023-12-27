
function getDiscussionItems() {
    return document.getElementsByClassName(DISCUSSION_ITEM_CLASS);
}


function getDiscussionItemUsername(discussionItem) {
    return discussionItem.children[0].children[0].children[1].children[0].children[0].children[0].children[0].innerText;
}


function discussionItemHasReplies(discussionItem) {
    return discussionItem.children.length > 1;
}


function getDiscussionItemReplies(discussionItem) {
    if (discussionItem.children.length <= 1) {
        return [];
    }

    let result = [];
    let repliesParent = discussionItem.children[1];

    for (let i = 0; i < repliesParent.children.length - 1; i++) {
        result.push(repliesParent.children[i]);
    }
    return result;
}


function getReplyUsername(replyItem) {
    return replyItem.children[0].children[1].children[0].children[0].children[0].children[0].innerText;
}


function discussionItemsUpdated(discussionItems, discussionItemsRepliesCount, newDiscussionItems) {
    if (discussionItems.length != newDiscussionItems.length) {
        return true;
    }
    
    for (let i = 0; i < discussionItems.length; i++) {
        if (!discussionItems[i].isEqualNode(newDiscussionItems[i]) ||
            discussionItemsRepliesCount[i] != getDiscussionItemReplies(newDiscussionItems[i]).length) {
            return true;
        }
    }
    return false;
}


function blockItem(item, username) {
    item.setAttribute("blocked-user", username);
}


function unhideUserItems(username) {
    let elements = document.querySelectorAll("[blocked-user='" + username + "']");

    for (let i = 0; i < elements.length; i++) {
        elements[i].removeAttribute("blocked-user");
    }
}


function addBlockButtonToDiscussionItem(discussionItem, onclick, username) {
    let actionBar = discussionItem.children[0].children[1].lastChild.children[0];

    if (actionBar.getElementsByClassName("block-button")[0]) {
        return;
    }

    let blockButton = document.createElement("button");
    blockButton.className = "block-button";
    blockButton.innerText = "Block";
    blockButton.addEventListener("click", function() {
        onclick(username);
    });

    actionBar.appendChild(blockButton);
}


function addBlockButtonToReply(replyItem, onclick, username) {
    let actionBar = replyItem.children[0].children[1].children[1].children[0];

    if (actionBar.getElementsByClassName("block-button")[0]) {
        return;
    }

    let blockButton = document.createElement("button");
    blockButton.className = "block-button";
    blockButton.innerText = "Block";
    blockButton.addEventListener("click", function() {
        onclick(username);
    });

    actionBar.appendChild(blockButton);
}