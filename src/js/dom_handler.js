
function getComments() {
    return document.getElementsByClassName("px-1 transition-[background] duration-500");
}


function getCommentUsername(commentElement) {
    return commentElement.children[0].children[0].children[1].children[0].children[0].children[0].children[0].innerText;
}


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


function getReplyUsername(replyElement) {
    return replyElement.children[0].children[1].children[0].children[0].children[0].children[0].innerText;
}


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


function blockElement(element, username) {
    element.setAttribute("blocked-user", username);
}


function unhideUserElements(username) {
    let elements = document.querySelectorAll("[blocked-user='" + username + "']");

    for (let i = 0; i < elements.length; i++) {
        elements[i].removeAttribute("blocked-user");
    }
}


function addBlockButtonToComment(commentElement, onclick, username) {
    let actionBar = commentElement.children[0].children[1].lastChild.children[0];

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