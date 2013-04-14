agUsp.dinamicContent = {
	categories: {  "cat=1": {titulo: "Cursos e palestras"}, 
		"cat=3": {titulo: "Agenda Cultural"},
		"cat=105": {titulo: "Defesas"},
		"cat=21": {titulo: "Editoriais"},
		"cat=4": {titulo: "Publicações"},
		"cat=5": {titulo: "Quadro de Avisos"},
		
		"cat=22": {titulo: "Ciências"},
		"cat=23": {titulo: "Cultura"},
		"cat=24": {titulo: "Educação"},
		"cat=25": {titulo: "Especiais"},
		"cat=26": {titulo: "Esporte e Lazer"},
		"cat=27": {titulo: "Institucional"},
		"cat=28": {titulo: "Meio ambiente"},
		"cat=29": {titulo: "Saúde"},
		"cat=30": {titulo: "Sociedade"},
		"cat=31": {titulo: "Tecnologia"},
		"cat=1143": {titulo: "Vídeos"},
		},
	categsInitialized : false,
		
	init : function() {
		$(document)
				.bind("pagebeforechange",
						function(e, data) {
							if (typeof data.toPage === "string") {
								var u = $.mobile.path.parseUrl(data.toPage), re = /^#categChange/;

								if (u.hash.search(re) !== -1) {
									agUsp.dinamicContent.showCategory(u,
											data.options);
									e.preventDefault();
								}
								
								if (u.hash.search(/^#categs/) !== -1) {
									if (agUsp.dinamicContent.categsInitialized == false)
										agUsp.dinamicContent.categoriesInit(u,
												data.options);
								}
							}
						});
	},

	showCategory : function(urlObj, options) {
		var categoryKey = urlObj.hash.replace(/.*\?/, ""), pageSelector = urlObj.hash
				.replace(/\?.*$/, ""),
			categoryName = agUsp.dinamicContent.categories[categoryKey].titulo;

		var $page = $(pageSelector), 
			$header = $page.children(":jqmData(role=header)"), 
			$content = $page.children(":jqmData(role=content)"), 
			markup = "<p>" + categoryName + "</p>";

		$header.find("h1").html(categoryName);

//		$content.html(markup);
		app.getResultsOnContainer(categoryKey, $content);
		
		$page.page();

		options.dataUrl = urlObj.href;

		$.mobile.changePage($page, options);
	},
	
	categoriesInit: function(urlObj, options) {
		var $page = $("#categs"), 
//		$header = $page.children(":jqmData(role=header)"), 
		$content = $page.children(":jqmData(role=content)"),
		$navbar = $content.children(":jqmData(role=navbar)"),
		markup = "<ul>";
		var categs = agUsp.dinamicContent.categories;
		for (var i in categs) {
			markup = markup + "<li><a href=\"#categChange?" + i + "\" data-icon=\"info\">" + categs[i].titulo + "</a></li>"; 
		}
		markup += "</ul>";
		
		$navbar.html(markup);

		$page.page();
		agUsp.dinamicContent.categsInitialized=true;
	}
}