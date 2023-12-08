
let discussionItems = [];
let discussionItemsRepliesCount = [];
let blockList = [];


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
        console.log(username);

        if (blockList.includes(username)) {
            console.log("blocking discussion post from: " + username);
        } else {
            let discussionItemReplies = getDiscussionItemReplies(discussionItems[i]);

            for (let j = 0; j < discussionItemReplies.length; j++) { 
                username = getReplyUsername(discussionItemReplies[j]);
                console.log(username);

                if (blockList.includes(username)) {
                    console.log("blocking reply from: " + username);
                }
            }
        }
    }
}


window.onload = function() {
    window.setInterval(function(){
        mainLoop();
    }, 100);
};
