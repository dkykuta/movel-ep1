var app = {
	url: "http://www.usp.br/agen/?feed=rss2",
	
	entriesCache: {},
		
    addFeedItem: function(container, feedItem) {
	    var string = "<div data-role=\"collapsible\"><h3>" + feedItem.title +
	    "</h3>" + feedItem.content + "</div>";
        container.append(string);
    },
    
    getResults: function() {
    	var feed = new google.feeds.Feed(app.url);
    	feed.setNumEntries(7);
    	feed.load(function(result) {
    		var container = $("#feedDiv");
    		if (!result.error) {
    			for (var i = 0; i < result.feed.entries.length; i++) {
    				var entry = result.feed.entries[i];
    				app.addFeedItem(container, entry);
    			}
    			container.trigger( "create" );
    		}
    	});
    },
	    

    googleFeedInitialize: function(url) {
    	google.load("feeds", "1");
    	app.url = url;
    	
    	google.setOnLoadCallback(app.getResults);
    }
};
