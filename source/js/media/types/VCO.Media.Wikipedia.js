/*	VCO.Media.Wikipedia
================================================== */

VCO.Media.Wikipedia = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			api_language,
			self = this;
		
		// Loading Message
		this.message.updateMessage(VCO.Language.messages.loading + " " + this.options.media_name);
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-wikipedia", this._el.content);
		
		// Get Media ID
		this.media_id	 = this.data.url.split("wiki\/")[1].split("#")[0].replace("_", " ");
		this.media_id	 = this.media_id.replace(" ", "%20");
		api_language	 = this.data.url.split("//")[1].split(".wikipedia")[0];
		
		// API URL
		api_url = "http://" + api_language + ".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles=" + this.media_id + "&exintro=1&format=json&callback=?";
		
		// API Call
		VCO.getJSON(api_url, function(d) {
			self.createMedia(d);
		});
		
	},
	createMedia: function(d) {
		var wiki = "";
		
		if (d.query) {
			var content,
				wiki = {
					entry: {},
					title: "",
					text: "",
					extract: "",
					paragraphs: 1,
					text_array: []
				};
			
			wiki.entry		 = VCO.Util.getObjectAttributeByIndex(d.query.pages, 0);
			wiki.extract	 = wiki.entry.extract;
			wiki.title		 = wiki.entry.title;
			
			if (wiki.extract.match("<p>")) {
				wiki.text_array = wiki.extract.split("<p>");
			} else {
				wiki.text_array.push(wiki.extract);
			}
			
			for(var i = 0; i < wiki.text_array.length; i++) {
				if (i+1 <= wiki.paragraphs && i+1 < wiki.text_array.length) {
					wiki.text	+= "<p>" + wiki.text_array[i+1];
				}
			}
			
			content		=	"<h4><a href='" + this.data.url + "' target='_blank'>" + wiki.title + "</a></h4>";
			content		+=	"<span class='wiki-source'>" + VCO.Language.messages.wikipedia + "</span>";
			content		+=	wiki.text;
			
			if (wiki.extract.match("REDIRECT")) {
			
			} else {
				// Add to DOM
				this._el.content_item.innerHTML	= content;
				// After Loaded
				this.onLoaded();
			}
			
			
		}
			
	},
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}
	
});
