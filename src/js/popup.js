
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("block-user-form-button").onclick = blockUserClicked;
    document.getElementById("unblock-all-button").onclick = unblockAllClicked;
    
    chrome.storage.local.get(["blocklist"], function (result) {
        let blockList = result.blocklist;

        for (let i = 0; i < blockList.length; i++) {
            addUserToList(blockList[i]);
        }
    });
});


function addUserToList(username) {
    let elementString = `<div class='blocked-user-item' username="` + username + `">
                         <a class='blocked-user-username'>` + username + `</a>
                         <button class='blocked-user-unblock-button'>Unblock</button>
                         </div>`;
    let element = new DOMParser().parseFromString(elementString, "text/html").body.childNodes[0];
    document.getElementById("block-list").appendChild(element);

    element.children[1].addEventListener("click", function() {
        unblockUserClicked(username);
    });
}


function removeUserFromList(username) {
    let blockListElement = document.getElementById("block-list");
    let userElement = blockListElement.querySelector(".blocked-user-item[username='" + username + "']");

    if (userElement) {
        userElement.remove();
    }
}


function blockUserClicked() {
    let username = document.getElementById("block-user-form-input").value;
    document.getElementById("block-user-form-input").value = "";

    let message = {
        action: "block-user",
        username: username
    };

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
            if (response) {
                addUserToList(username);
            }
        });
    });
}


function unblockUserClicked(username) {
    let message = {
        action: "unblock-user",
        username: username
    };

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
            if (response) {
                removeUserFromList(username);
            }
        });
    });
}


function unblockAllClicked() {
    let message = {
        action: "unblock-all"
    };

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });

    document.getElementById("block-list").replaceChildren();
}