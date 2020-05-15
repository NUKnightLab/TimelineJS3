/*	TL.Media.Blockquote
================================================== */

TL.Media.Blockquote = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {		
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-blockquote", this._el.content);
		this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API Call
		this._el.content_item.innerHTML = this.media_id;
		
		// After Loaded
		this.onLoaded();
	},
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}

	
});
