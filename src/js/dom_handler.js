
// Get all comment elements from the discussion
function getComments() {
    return document.getElementsByClassName("px-1 transition-[background] duration-500");
}


// Get username of a comment's author
function getCommentUsername(commentElement) {
    return commentElement.children[0].children[0].children[1].children[0].children[0].children[0].children[0].innerText;
}


// Get reply elements of a comment element
function getCommentReplies(commentElement) {
    if (commentElement.children.length <= 1) {
        return [];
    }

    let result = [];
    let repliesParent = commentElement.children[1];

    for (let i = 0; i < repliesParent.children.length - 1; i++) {
        result.push(repliesParent.children[i]);
    }
    return result;
}


// Get username of a reply's author
function getReplyUsername(replyElement) {
    return replyElement.children[0].children[1].children[0].children[0].children[0].children[0].innerText;
}


// Check if something in the elements has changed (e.g. comments or reply count changed)
function elementsUpdated(commentElements, commentElementsReplyCount, newCommentElements) {
    if (commentElements.length != newCommentElements.length) {
        return true;
    }
    
    for (let i = 0; i < commentElements.length; i++) {
        if (!commentElements[i].isEqualNode(newCommentElements[i]) ||
            commentElementsReplyCount[i] != getCommentReplies(newCommentElements[i]).length) {
            return true;
        }
    }
    return false;
}


// Hide an element and set blocked-user attribute to username so it can be unblocked again
function blockElement(element, username) {
    element.setAttribute("blocked-user", username);
}


// Unhide all blocked elements of a user
function unhideUserElements(username) {
    let elements = document.querySelectorAll("[blocked-user='" + username + "']");

    for (let i = 0; i < elements.length; i++) {
        elements[i].removeAttribute("blocked-user");
    }
}


// Add a block button with block functionality to the action bar of a comment
function addBlockButtonToComment(commentElement, onclick, username) {
    let actionBar = commentElement.children[0].children[1].lastChild.children[0];

    // If block button already added, return
    if (actionBar.getElementsByClassName("block-button")[0]) {
        return;
    }

    // Create and append block button
    let blockButton = document.createElement("button");
    blockButton.className = "block-button";
    blockButton.innerText = "Block";
    blockButton.addEventListener("click", function() {
        onclick(username);
    });

    actionBar.appendChild(blockButton);
}


// Add a block button with block functionality to the action bar of a reply
function addBlockButtonToReply(replyItem, onclick, username) {
    let actionBar = replyItem.children[0].children[1].children[1].children[0];

    // If block button already added, return
    if (actionBar.getElementsByClassName("block-button")[0]) {
        return;
    }

    // Create and append block button
    let blockButton = document.createElement("button");
    blockButton.className = "block-button";
    blockButton.innerText = "Block";
    blockButton.addEventListener("click", function() {
        onclick(username);
    });

    actionBar.appendChild(blockButton);
}