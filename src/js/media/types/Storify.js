/*	TL.Media.Storify
================================================== */

TL.Media.Storify = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var content;
				
		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-storify", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// Content
		content =	"<iframe frameborder='0' width='100%' height='100%' src='" + this.media_id + "/embed'></iframe>";
		content +=	"<script src='" + this.media_id + ".js'></script>";
		
		// API Call
		this._el.content_item.innerHTML = content;
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}
	
	
});
