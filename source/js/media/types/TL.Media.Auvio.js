/*	TL.Media.Auvio
================================================== */

// Example of embed URL for Auvio medias
// Regular URL
// http://www.rtbf.be/auvio/embed/media?id=1888439 
// URL used for external partners
// http://www.rtbf.be/embed/m?id=1888439

TL.Media.Auvio = TL.Media.extend({
	rtbfBaseUrl: '',
	rtbfPathname: '',

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var iframe_src,
			url_str = '',
			url_arr = '',
			env = '',
			self = this;

		// Create Dom element
		this._el.content_item	= TL.Dom.create('div', 'tl-media-item tl-media-iframe tl-media-auvio tl-media-shadow', this._el.content);

		// Get the environment (`local.`, `itt`. or `` aka prd) of the hosting page...
		// Because a local page should load the local version of the auvio page
		// or else the player will NOT execute the pause action
		url_str = window.location.toString();
		url_arr = url_str.split(/rtbf\.be/);
		if (url_arr.length > 1) {
			url_str = url_arr[0]; // http://www.local.
			url_arr = url_str.split(/\/\/www\./);
			if (url_arr.length > 1) {
				env = url_arr[1];
			}
		}

		// Build the base URL:
		// - Without protocol in order to get `http` or `https` automagically
		// - With the optional environment
		rtbfBaseUrl = '//www.' + env + 'rtbf.be';

		// Build Pathname
		url_str = this.data.url;
		url_arr = url_str.split(/rtbf\.be/);
		if (url_arr.length > 1) {
			rtbfPathname = url_arr[1];
			url_str = rtbfPathname;
			url_arr = url_str.split(/\?/);
			if (url_arr.length > 1) {
				rtbfPathname = url_arr[0];
			}
		}

		// Get Media ID
		this.media_id = this.data.url.split(/[?&]id=/)[1].split(/[?&]/)[0];

		// API URL
		iframe_src = rtbfBaseUrl + rtbfPathname + '?id=' + this.media_id;

		this.player = TL.Dom.create('iframe', '', this._el.content_item);

		// Media Loaded Event
		this.player.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		this.player.width				= '100%';
		this.player.height			= '100%';
		this.player.frameBorder = '0';
		this.player.src					= iframe_src;

		this.player.setAttribute('allowfullscreen', '');
		this.player.setAttribute('webkitallowfullscreen', '');
		this.player.setAttribute('mozallowfullscreen', '');

		// After Loaded
		this.onLoaded();
	},

	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = TL.Util.ratio.r16_9({w:this._el.content_item.offsetWidth}) + 'px';
	},

	_stopMedia: function() {

		try {
			var pauseEvt = $.Event('externalPlayerVideoMessage', {action: 'pause'});
			$('body').trigger(pauseEvt);
		}
		catch(err) {
			trace(err);
		}

	}
});
