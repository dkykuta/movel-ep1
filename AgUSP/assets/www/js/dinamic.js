agUsp.dinamicContent = {
	init : function() {
		// Listen for any attempts to call changePage().
		$(document)
				.bind("pagebeforechange",
						function(e, data) {

							// We only want to handle changePage() calls where
							// the caller is
							// asking us to load a page by URL.
							if (typeof data.toPage === "string") {

								// We are being asked to load a page by URL, but
								// we only
								// want to handle URLs that request the data for
								// a specific
								// category.
								var u = $.mobile.path.parseUrl(data.toPage), re = /^#categChange/;

								if (u.hash.search(re) !== -1) {

									// We're being asked to display the items
									// for a specific category.
									// Call our internal method that builds the
									// content for the category
									// on the fly based on our in-memory
									// category data structure.
									agUsp.dinamicContent.showCategory(u,
											data.options);

									// Make sure to tell changePage() we've
									// handled this call so it doesn't
									// have to do anything.
									e.preventDefault();
								}
							}
						});
	},

	showCategory : function(urlObj, options) {
		var categoryName = urlObj.hash.replace(/.*\?/, ""), pageSelector = urlObj.hash
				.replace(/\?.*$/, "");

		var $page = $(pageSelector), 
			$header = $page.children(":jqmData(role=header)"), 
			$content = $page.children(":jqmData(role=content)"), 
			markup = "<p>" + categoryName + "</p>";

		$header.find("h1").html(categoryName);

		$content.html(markup);
		
		$page.page();

//			$content.find(":jqmData(role=listview)").listview();

		options.dataUrl = urlObj.href;

		$.mobile.changePage($page, options);
	}
}