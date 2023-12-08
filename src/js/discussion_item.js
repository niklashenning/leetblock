
function getDiscussionItems() {
    return document.getElementsByClassName("px-1 transition-[background] duration-500");
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