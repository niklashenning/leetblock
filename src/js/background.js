
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "block-button-clicked") {
        let message = {
            action: "block-user",
            username: request.username
        };
    
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, message, function(response) {
                    if (!chrome.runtime.lastError) {
                        // Needed for extension not to show errors when sending
                        // to tabs that don't have the content script injected
                    }
                });
            });
        });
    }
});