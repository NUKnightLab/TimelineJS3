/*	TL.Media.Website
	Uses Embedly
	http://embed.ly/docs/api/extract/endpoints/1/extract
================================================== */

TL.Media.Website = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this;
		
		// Get Media ID
		this.media_id = this.data.url.replace(/.*?:\/\//g, "");

		if (this.options.api_key_embedly) {
			// API URL
			api_url = "http://api.embed.ly/1/extract?key=" + this.options.api_key_embedly + "&url=" + this.media_id + "&callback=?";
			
			// API Call
			TL.getJSON(api_url, function(d) {
				self.createMedia(d);
			});
		} else {
			this.createCardContent();
		}
	},
	
	createCardContent: function() {
		(function(w, d){
			var id='embedly-platform', n = 'script';
			if (!d.getElementById(id)){
			 w.embedly = w.embedly || function() {(w.embedly.q = w.embedly.q || []).push(arguments);};
			 var e = d.createElement(n); e.id = id; e.async=1;
			 e.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://cdn.embedly.com/widgets/platform.js';
			 var s = d.getElementsByTagName(n)[0];
			 s.parentNode.insertBefore(e, s);
			}
		})(window, document);

		var content = "<a href=\"" + this.data.url + "\" class=\"embedly-card\">" + this.data.url + "</a>";
		this._setContent(content);

	},
	createMedia: function(d) { // this costs API credits...
		var content = "";
		
		
		content		+=	"<h4><a href='" + this.data.url + "' target='_blank'>" + d.title + "</a></h4>";
		if (d.images) {
			if (d.images[0]) {
				trace(d.images[0].url);
				content		+=	"<img src='" + d.images[0].url + "' />";
			}
		}
		if (d.favicon_url) {
			content		+=	"<img class='tl-media-website-icon' src='" + d.favicon_url + "' />";
		}
		content		+=	"<span class='tl-media-website-description'>" + d.provider_name + "</span><br/>";
		content		+=	"<p>" + d.description + "</p>";
		
		this._setContent(content);
	},

	_setContent: function(content) {
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-website", this._el.content);
		this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
		this._el.content_item.innerHTML = content;
		
		// After Loaded
		this.onLoaded();

	},
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}
	
	
});
