/*	TL.Media.Flickr

================================================== */

TL.Media.Imgur = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		try {
			var self = this;

			if (this.data.url.match("<blockquote class=['\"]imgur-embed-pub['\"]")){
				var found = this.data.url.match(/(imgur\.com)\/(\w+)/);
				this.media_id = found[2];
				this.data.url = "http://imgur.com/gallery/" + this.media_id;
			}
			else if (this.data.url){
				this.media_id = this.data.url.split('/').slice(-1)[0];
			}

	        TL.Load.js([
						'https://s.imgur.com/min/embed.js'], 
					function(){
						self.createMedia();
					}
			);

		} catch(e) {
		    this.loadErrorDisplay(this._("imgur_invalidurl_err"));
		}
	},

	createMedia: function() {
	    var self = this;
		var api_url = "https://api.imgur.com/oembed.json?url=" + this.data.url;

		// Content div
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-image tl-media-imgur",
																								this._el.content);

		// API Call

          TL.ajax({
          	type: 'GET',
            url: api_url,
            dataType: 'json',
            success: function(data){
            try {
                self._el.content_item.innerHTML	= data.html;
            	setInterval(function(){
            		if(document.querySelector("blockquote.imgur-embed-pub") == null){
            			clearInterval();
            		}
            		else{
            			imgurEmbed.createIframe();
            			document.getElementById("imageElement").removeAttribute("style");
            			document.getElementById("image").removeAttribute("style");
            		}
            	}, 2000);
            } catch(e) {
            }
            },
            error: function(xhr, errorType, error) {
              tc = new TL.TimelineConfig();
              if (errorType == 'parsererror') {
                var error = new TL.Error("invalid_url_err");
              } else {
                var error = new TL.Error("unknown_read_err", errorType);
              }
              self.loadErrorDisplay(self._("imgur_invalidurl_err"));
              tc.logError(error);
            }
          });

         this.onLoaded();

	},



	_updateMediaDisplay: function() {
		//this.el.content_item = document.getElementById(this._el.content_item.id);
		this._el.content_item.style.width = this.options.width + "px";
		this._el.content_item.style.height = TL.Util.ratio.r16_9({w:this.options.width}) + "px";
	}

});
