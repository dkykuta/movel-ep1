var app = {
	url: "http://www.usp.br/agen/?feed=rss2",
	
	entriesCache: {},
		
    addFeedItem: function(string) {
    	var container = document.getElementById("feedDiv");
	    var div = document.createElement("div");
	    div.appendChild(document.createTextNode(string));
	    div.setAttribute("class", "feedItem");
        container.appendChild(div);
    },
    
    getResults: function() {
    	var feed = new google.feeds.Feed(app.url);
    	feed.setNumEntries(7);
    	feed.load(function(result) {
    		if (!result.error) {
    			for (var i = 0; i < result.feed.entries.length; i++) {
    				var entry = result.feed.entries[i];
    				app.addFeedItem(entry.title);
    			}
    		}
    	});
    },
	    

    googleFeedInitialize: function(url) {
    	google.load("feeds", "1");
    	
    	google.setOnLoadCallback(app.getResults);
    }
};
