/*	TL.Media.SLider
	Produces a Slider
	Takes a data object and populates a dom object
	TODO
	Placeholder
================================================== */

TL.Media.Slider = TL.Media.extend({
	
	includes: [TL.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		
		this._el.content_item				= TL.Dom.create("img", "tl-media-item tl-media-image", this._el.content);
		this._el.content_item.src			= this.data.url;
		
		this.onLoaded();
	}
	
});