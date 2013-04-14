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
    	var cacheFeeds = app.settings.getCachedFeed(category);
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
        			app.settings.saveFeed(result.feed.entries, category);
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
    
    getEntryID: function(entry) {
    	var entryLink = entry.link.split('=');
    	return entryLink[entryLink.length - 1];
    },
    
    /////////////////////////////////////////////////////////////////////
    // holds getters and setters for config settings and persistent data.
    settings: {
    	FEED_ENTRY_KEY: "feedEntry",
    	FEED_CATEGORY_KEY: "feedCat",
    	NUM_ENTRIES_KEY: "numEntries",
    
        saveFeed: function(feeds, category) {
        	category = typeof category !== 'undefined' ? category : 'all';
        	var ids = app.settings.getFeedCategoryIDList(category);
        	if (ids == null) { ids = []; }
        	for (var i = 0; i < feeds.length; i++) {
    			var entry = feeds[i];
    			var id = app.getEntryID(entry);
    			if (ids.indexOf(id) == -1) {
    				ids.push(id);
    			}
    			localStorage.setItem(app.settings.FEED_ENTRY_KEY+id, JSON.stringify(entry));
    		}
        	localStorage.setItem(app.settings.FEED_CATEGORY_KEY+category, JSON.stringify(ids));
        },
        
        getCachedFeed: function(category) {
        	category = typeof category !== 'undefined' ? category : 'all';
        	var ids = app.settings.getFeedCategoryIDList(category);
        	if (ids == null) { ids = []; }
        	var entries = [];
        	for (var i = 0; i < ids.length; i++) {
    			var id = ids[i];
    			var entry = localStorage.getItem(app.settings.FEED_ENTRY_KEY+id);
            	if (entry != null) {
            		entries.push( JSON.parse(entry) );
            	}
    		}
        	return entries.length > 0 ? entries : null;
        },
        
        getFeedCategoryIDList: function(category) {
        	var cache = localStorage.getItem(app.settings.FEED_CATEGORY_KEY+category);
        	if (cache != null) {
        		return JSON.parse(cache);
        	}
        	return null;
        },
        
        removeCachedFeed: function(category) {
        	category = typeof category !== 'undefined' ? category : 'all';
        	var ids = app.settings.getFeedCategoryIDList(category);
        	if (ids != null) {
        		for (var i = 0; i < ids.length; i++) {
        			var id = ids[i];
        			localStorage.removeItem(app.settings.FEED_ENTRY_KEY+id);
        		}
        	}
        	localStorage.removeItem(app.settings.FEED_CATEGORY_KEY+category);
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
