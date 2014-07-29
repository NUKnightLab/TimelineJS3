/*	VCO.Media.Image
	Produces image assets.
	Takes a data object and populates a dom object
================================================== */
// TODO Add link

VCO.Media.Image = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		// Loading Message
		this.message.updateMessage(VCO.Language.messages.loading + " " + this.options.media_name);
		
		this._el.content_item				= VCO.Dom.create("img", "vco-media-item vco-media-image vco-media-shadow", this._el.content);
		this._el.content_item.src			= this.data.url;
		
		this.onLoaded();
	},
	
	_updateMediaDisplay: function(layout) {
		
		
		if(VCO.Browser.firefox) {
			this._el.content_item.style.maxWidth = (this.options.width/2) - 40 + "px";
		}
	}
	
});