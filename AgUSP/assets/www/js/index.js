var app = {
	url: "http://www.usp.br/agen/?feed=rss2",
	
	lastCateg: "all",
	
	//pra iterar pelo dict D: for(var x in D) { console.log(x, D[x]); }
	categoriesMap: {  "Cursos e palestras":1, 
						"Agenda Cultural":3,
						"Defesas":105,
						"Editoriais":21,
						"Publicações":4,
						"Quadro de Avisos":5,
						
						"Ciências":22,
						"Cultura":23,
						"Educação":24,
						"Especiais":25,
						"Esporte e Lazer":26,
						"Institucional":27,
						"Meio ambiente":28,
						"Saúde":29,
						"Sociedade":30,
						"Tecnologia":31,
						"Vídeos":1143,
						},

	entriesCache: {},
		
	addFeeds: function(container, feeds) {
		for (var i = 0; i < feeds.length; i++) {
			var entry = feeds[i];
			app.addFeedItem(container, entry);
		}
		container.trigger( "create" );
	},
	
    addFeedItem: function(container, feedItem) {
	    var string = "<div data-role=\"collapsible\"><h3>" + feedItem.title +
	    "</h3>" + feedItem.content + "</div>";
        container.append(string);
    },
    
    getResults: function(category) {
    	var container = $("#feedDiv");
    	var cacheFeeds = app.settings.getCachedFeed();
    	if (cacheFeeds!=null) {
    		console.log("LOADING FROM CACHE");
    		app.addFeeds(container, cacheFeeds);
    	}
    	else { 
    		console.log("USING FEED API TO LOAD");
    		feedurl = app.url;
    		if (category != "all") {
    			feedurl = app.url + "&" + category;
    		}
    		console.log(feedurl);
    		var feed = new google.feeds.Feed(feedurl);
    		feed.includeHistoricalEntries();
        	feed.setNumEntries(app.settings.getNumFeedEntries());
        	feed.load(function(result) {
        		if (!result.error) {
        			app.addFeeds(container, result.feed.entries);
        			app.settings.saveFeed(result.feed.entries);
        		}
        	});
    	}
    },
    
    changeToCategory: function(categ) {
    	console.log("CHANGE PAGE TO " + categ);
    	app.lastCateg = categ;
    	app.settings.removeCachedFeed();
    	var container = $("#feedDiv");
    	container.empty(); //this removes all childs of container, leaving it empty
    	app.getResults(categ);
    },
    
    changeToCategoryAndClosePanel: function(categ) {
    	app.changeToCategory(categ);
    	$( "#categP" ).panel( "close" );
    },
	    
    refresh: function() {
    	console.log("REFRESHING " + app.lastCateg);
//    	app.settings.removeCachedFeed();
//    	var container = $("#feedDiv");
//    	container.empty(); //this removes all childs of container, leaving it empty
//    	app.getResults("all");
    	app.changeToCategory(app.lastCateg)
    },
    
    init: function() {
    	app.googleFeedInitialize("http://www.usp.br/agen/?feed=rss2");
    },
    
    googleFeedInitialize: function(url) {
    	google.load("feeds", "1");
    	app.url = url;
    	
    	//use isso pra limpar o cache
    	//localStorage.clear();
    	//  ou
    	//localStorage.removeItem(key)
		google.setOnLoadCallback(app.getResults);
    },
    
    /////////////////////////////////////////////////////////////////////
    // holds getters and setters for config settings and persistent data.
    settings: {
    	FEED_CACHE_KEY: "feedCache",
    	NUM_ENTRIES_KEY: "numEntries",
    
        saveFeed: function(feed) {
        	localStorage.setItem(app.settings.FEED_CACHE_KEY, JSON.stringify(feed));
        },
        
        getCachedFeed: function() {
        	var cache = localStorage.getItem(app.settings.FEED_CACHE_KEY);
        	if (cache != null) {
        		return JSON.parse(cache);
        	}
        	return null;
        },
        
        removeCachedFeed: function() {
        	localStorage.removeItem(app.settings.FEED_CACHE_KEY);
        },
        
        setNumFeedEntries: function(num) {
        	localStorage.setItem(app.settings.NUM_ENTRIES_KEY, num);
        },
        
        getNumFeedEntries: function() {
        	var num = localStorage.getItem(app.settings.NUM_ENTRIES_KEY);
        	if (num != null) {
        		return parseInt(num);
        	}
        	return 20; //default value
        },
    }
};
