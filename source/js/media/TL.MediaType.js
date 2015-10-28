/*	TL.MediaType
	Determines the type of media the url string is.
	returns an object with .type and .id
	You can add new media types by adding a regex
	to match and the media class name to use to
	render the media
	
	The image_only parameter indicates that the
	call only wants an image-based media type
	that can be resolved to an image URL.

	TODO
	Allow array so a slideshow can be a mediatype
================================================== */
TL.MediaType = function(m, image_only) {
	var media = {},
		media_types = 	[
			{
				type: 		"youtube",
				name: 		"YouTube",
				match_str: 	"^(https?:)?\/*(www.)?youtube|youtu\.be",
				cls: 		TL.Media.YouTube
			},
			{
				type: 		"vimeo",
				name: 		"Vimeo",
				match_str: 	"^(https?:)?\/*(player.)?vimeo\.com",
				cls: 		TL.Media.Vimeo
			},
			{
				type: 		"dailymotion",
				name: 		"DailyMotion",
				match_str: 	"^(https?:)?\/*(www.)?dailymotion\.com",
				cls: 		TL.Media.DailyMotion
			},
			{
				type: 		"vine",
				name: 		"Vine",
				match_str: 	"^(https?:)?\/*(www.)?vine\.co",
				cls: 		TL.Media.Vine
			},
			{
				type: 		"soundcloud",
				name: 		"SoundCloud",
				match_str: 	"^(https?:)?\/*(player.)?soundcloud\.com",
				cls: 		TL.Media.SoundCloud
			},
			{
				type: 		"twitter",
				name: 		"Twitter",
				match_str: 	"^(https?:)?\/*(www.)?twitter\.com",
				cls: 		TL.Media.Twitter
			},
			{
				type: 		"twitterembed",
				name: 		"TwitterEmbed",
				match_str: 	"<blockquote class=\"twitter-tweet\"",
				cls: 		TL.Media.TwitterEmbed
			},
			{
				type: 		"googlemaps",
				name: 		"Google Map",
				match_str: 	/google.+?\/maps\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/search\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/place\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/dir\/([\w\W]+)\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)/,
				cls: 		TL.Media.GoogleMap
			},
			{
				type: 		"googleplus",
				name: 		"Google+",
				match_str: 	"^(https?:)?\/*plus.google",
				cls: 		TL.Media.GooglePlus
			},
			{
				type: 		"flickr",
				name: 		"Flickr",
				match_str: 	"^(https?:)?\/*(www.)?flickr.com\/photos",
				cls: 		TL.Media.Flickr
			},
			{
				type: 		"flickr",
				name: 		"Flickr",
				match_str: 	"^(https?:\/\/)?flic.kr\/.*",
				cls: 		TL.Media.Flickr
			},
			{
				type: 		"instagram",
				name: 		"Instagram",
				match_str: 	/^(https?:)?\/*(www.)?(instagr.am|^(https?:)?\/*(www.)?instagram.com)\/p\//,
				cls: 		TL.Media.Instagram
			},
			{
				type: 		"profile",
				name: 		"Profile",
				match_str: 	/^(https?:)?\/*(www.)?instagr.am\/[a-zA-Z0-9]{2,}|^(https?:)?\/*(www.)?instagram.com\/[a-zA-Z0-9]{2,}/,
				cls: 		TL.Media.Profile
			},
			{
			    type:       "documentcloud",
			    name:       "Document Cloud",
			    match_str:  /documentcloud.org\//,
			    cls:        TL.Media.DocumentCloud
			},
			{
				type: 		"image",
				name: 		"Image",
				match_str: 	/(jpg|jpeg|png|gif|svg)(\?.*)?$/i,
				cls: 		TL.Media.Image
			},
			{
				type: 		"imgur",
				name: 		"Imgur",
				match_str: 	/^.*imgur.com\/.+$/i,
				cls: 		TL.Media.Imgur
			},
			{
				type: 		"googledocs",
				name: 		"Google Doc",
				match_str: 	"^(https?:)?\/*[^.]*.google.com\/[^\/]*\/d\/[^\/]*\/[^\/]*\?usp=sharing|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*\&authuser=0|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*|^(https?:)?\/*[^.]*.googledrive.com\/host\/[^\/]*\/",
				cls: 		TL.Media.GoogleDoc
			},
			{
				type: 		"pdf",
				name: 		"PDF",
				match_str: 	/^.*\.pdf(\?.*)?(\#.*)?/,
				cls: 		TL.Media.PDF
			},
			{
				type: 		"wikipedia",
				name: 		"Wikipedia",
				match_str: 	"^(https?:)?\/*(www.)?wikipedia\.org|^(https?:)?\/*([a-z][a-z].)?wikipedia\.org",
				cls: 		TL.Media.Wikipedia
			},
			{
				type: 		"spotify",
				name: 		"spotify",
				match_str: 	"spotify",
				cls: 		TL.Media.Spotify
			},
			{
				type: 		"iframe",
				name: 		"iFrame",
				match_str: 	"iframe",
				cls: 		TL.Media.IFrame
			},
			{
				type: 		"storify",
				name: 		"Storify",
				match_str: 	"storify",
				cls: 		TL.Media.Storify
			},
			{
				type: 		"blockquote",
				name: 		"Quote",
				match_str: 	"blockquote",
				cls: 		TL.Media.Blockquote
			},
			// {
			// 	type: 		"website",
			// 	name: 		"Website",
			// 	match_str: 	"https?://",
			// 	cls: 		TL.Media.Website
			// },
			{
				type: 		"imageblank",
				name: 		"Imageblank",
				match_str: 	"",
				cls: 		TL.Media.Image
			}
		];
	
	if(image_only) {
        if (m instanceof Array) {
            return false;
        }
        for (var i = 0; i < media_types.length; i++) {
            switch(media_types[i].type) {
                case "flickr":
                case "image":
                case "imgur":
                case "instagram":
                    if (m.url.match(media_types[i].match_str)) {
                        media = media_types[i];
                        return media;
                    }
                    break;
                
                default:
                    break;            
            }
        }        
	
	} else {
        for (var i = 0; i < media_types.length; i++) {
            if (m instanceof Array) {
                return media = {
                    type: 		"slider",
                    cls: 		TL.Media.Slider
                };
            } else if (m.url.match(media_types[i].match_str)) {
                media 		= media_types[i];
                return media;
            }
        };
    }

	return false;

}
