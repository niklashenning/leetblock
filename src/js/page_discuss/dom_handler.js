
// On the discuss page, both comments and replies have the same class
// and are children of the same parent, so both will be called comments here


// Get all comment elements from the discussion
function getComments() {
    return document.getElementsByClassName("comment__3raU");
}


// Get username of a comment's author
function getCommentUsername(commentElement) {
    let indentation = commentElement.getAttribute("indentation");

    if (indentation === "0") {
        return commentElement.children[0].children[1].children[0].children[0].children[0].children[0].innerText;
    } else {
        return commentElement.children[0].children[1].children[0].children[0].children[0].innerText;
    }
}


// Check if something in the elements has changed (e.g. comment count changed)
function elementsUpdated(commentElements, newCommentElements) {
    if (commentElements.length != newCommentElements.length) {
        return true;
    }
    
    for (let i = 0; i < commentElements.length; i++) {
        if (!commentElements[i].isEqualNode(newCommentElements[i])) {
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
    let actionBar = commentElement.children[1].children[1];

    // If block button already added, return
    if (actionBar.getElementsByClassName("block-button")[0]) {
        return;
    }

    // Create and append block button
    let blockButton = document.createElement("button");
    blockButton.className = "block-button";
    blockButton.innerText = "Block";
    blockButton.setAttribute("page", "discuss");
    blockButton.addEventListener("click", function() {
        onclick(username);
    });

    for (let i = 0; i < actionBar.children.length; i++) {
        let dataShowOnHover = actionBar.children[i].getAttribute("data-show-on-hover");

        if (dataShowOnHover === "true") {
            actionBar.insertBefore(blockButton, actionBar.children[i]);
            break;
        }
    }
}
