/*	TL.Media.Profile

================================================== */

TL.Media.Profile = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		
		this._el.content_item				= TL.Dom.create("img", "tl-media-item tl-media-image tl-media-profile tl-media-shadow", this._el.content);
		this._el.content_item.src			= this.data.url;
		
		this.onLoaded();
	},
	
	_updateMediaDisplay: function(layout) {
		
		
		if(TL.Browser.firefox) {
			this._el.content_item.style.maxWidth = (this.options.width/2) - 40 + "px";
		}
	}
	
});