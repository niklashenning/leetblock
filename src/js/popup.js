
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("block-user-form-button").onclick = blockUserClicked;
    document.getElementById("unblock-all-button").onclick = unblockAllClicked;
});


function blockUserClicked() {
    let username = document.getElementById("block-user-form-input").value;
    let message = {
        action: "block-user",
        username: username
    };

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}


function unblockAllClicked() {
    let message = {
        action: "unblock-all"
    };

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}