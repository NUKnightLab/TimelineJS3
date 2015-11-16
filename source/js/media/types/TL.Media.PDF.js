/*	TL.Media.PDF
 * Chrome and Firefox on both OSes and Safari all support PDFs as iframe src.
 * This prompts for a download on IE10/11. We should investigate using
 * https://mozilla.github.io/pdf.js/ to support showing PDFs on IE.
================================================== */

TL.Media.PDF = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var url,
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-iframe", this._el.content);
		var markup = "";
		// not assigning media_id attribute. Seems like a holdover which is no longer used.
		if (TL.Browser.ie || TL.Browser.edge) {
			markup = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='//docs.google.com/viewer?url=" + this.data.url + "&amp;embedded=true'></iframe>";
		} else {
			markup = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + this.data.url + "'></iframe>"
		}
		this._el.content_item.innerHTML	= markup
		this.onLoaded();
	},

	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}


});
