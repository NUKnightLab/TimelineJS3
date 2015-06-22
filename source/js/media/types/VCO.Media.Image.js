/*	VCO.Media.Image
	Produces image assets.
	Takes a data object and populates a dom object
================================================== */

VCO.Media.Image = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this,
			image_class = "vco-media-item vco-media-image vco-media-shadow";
		// Loading Message
		this.loadingMessage();
		
		if (this.data.url.match(/.png(\?.*)?$/)) {
			image_class = "vco-media-item vco-media-image"
		}
		
		// Link
		if (this.data.link) {
			this._el.content_link 				= VCO.Dom.create("a", "", this._el.content);
			this._el.content_link.href 			= this.data.link;
			this._el.content_link.target 		= "_blank";
			this._el.content_item				= VCO.Dom.create("img", image_class, this._el.content_link);
		} else {
			this._el.content_item				= VCO.Dom.create("img", image_class, this._el.content);
		}
		
		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});
		
		this._el.content_item.src			= this._transformURL(this.data.url);
		
		this.onLoaded();
	},
	
	_transformURL: function(url) {
        return url.replace(/(.*)www.dropbox.com\/(.*)/, '$1dl.dropboxusercontent.com/$2')
	},
	
	_updateMediaDisplay: function(layout) {
		
		
		if(VCO.Browser.firefox) {
			//this._el.content_item.style.maxWidth = (this.options.width/2) - 40 + "px";
			this._el.content_item.style.width = "auto";
		}
		
	}
	
});