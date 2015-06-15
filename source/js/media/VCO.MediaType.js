/*	VCO.MediaType
	Determines the type of media the url string is.
	returns an object with .type and .id
	You can add new media types by adding a regex 
	to match and the media class name to use to 
	render the media 

	TODO
	Allow array so a slideshow can be a mediatype
================================================== */
VCO.MediaType = function(m) {
	var media = {}, 
		media_types = 	[
			{
				type: 		"youtube",
				name: 		"YouTube", 
				match_str: 	"^(https?:)?\/*(www.)?youtube|youtu\.be",
				cls: 		VCO.Media.YouTube
			},
			{
				type: 		"vimeo",
				name: 		"Vimeo", 
				match_str: 	"^(https?:)?\/*(player.)?vimeo\.com",
				cls: 		VCO.Media.Vimeo
			},
			{
				type: 		"dailymotion",
				name: 		"DailyMotion", 
				match_str: 	"^(https?:)?\/*(www.)?dailymotion\.com",
				cls: 		VCO.Media.DailyMotion
			},
			{
				type: 		"vine",
				name: 		"Vine", 
				match_str: 	"^(https?:)?\/*(www.)?vine\.co",
				cls: 		VCO.Media.Vine
			},
			{
				type: 		"soundcloud",
				name: 		"SoundCloud", 
				match_str: 	"^(https?:)?\/*(player.)?soundcloud\.com",
				cls: 		VCO.Media.SoundCloud
			},
			{
				type: 		"twitter",
				name: 		"Twitter", 
				match_str: 	"^(https?:)?\/*(www.)?twitter\.com",
				cls: 		VCO.Media.Twitter
			},
			{
				type: 		"twitterembed",
				name: 		"TwitterEmbed", 
				match_str: 	"<blockquote class=\"twitter-tweet\"",
				cls: 		VCO.Media.TwitterEmbed
			},
			{
				type: 		"googlemaps",
				name: 		"Google Map", 
				match_str: 	/google.+?\/maps\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/search\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/place\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/dir\/([\w\W]+)\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)/,
				cls: 		VCO.Media.Map
			},
			{
				type: 		"googleplus",
				name: 		"Google+", 
				match_str: 	"^(https?:)?\/*plus.google",
				cls: 		VCO.Media.GooglePlus
			},
			{
				type: 		"flickr",
				name: 		"Flickr", 
				match_str: 	"^(https?:)?\/*(www.)?flickr.com\/photos",
				cls: 		VCO.Media.Flickr
			},
			{
				type: 		"instagram",
				name: 		"Instagram", 
				match_str: 	/^(https?:)?\/*(www.)?(instagr.am|^(https?:)?\/*(www.)?instagram.com)\/p\//,
				cls: 		VCO.Media.Instagram
			},
			{
				type: 		"profile",
				name: 		"Profile", 
				match_str: 	/^(https?:)?\/*(www.)?instagr.am\/[a-zA-Z0-9]{2,}|^(https?:)?\/*(www.)?instagram.com\/[a-zA-Z0-9]{2,}/,
				cls: 		VCO.Media.Profile
			},
			{
			    type:       "documentcloud",
			    name:       "Document Cloud",
			    match_str:  /documentcloud.org\//,
			    cls:        VCO.Media.DocumentCloud
			},
			{
				type: 		"image",
				name: 		"Image",
				match_str: 	/(jpg|jpeg|png|gif)(\?.*)?$/i,
				cls: 		VCO.Media.Image
			},
			{
				type: 		"googledocs",
				name: 		"Google Doc",
				match_str: 	"^(https?:)?\/*[^.]*.google.com\/[^\/]*\/d\/[^\/]*\/[^\/]*\?usp=sharing|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*\&authuser=0|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*|^(https?:)?\/*[^.]*.googledrive.com\/host\/[^\/]*\/",
				cls: 		VCO.Media.GoogleDoc
			},
			{
				type: 		"wikipedia",
				name: 		"Wikipedia",
				match_str: 	"^(https?:)?\/*(www.)?wikipedia\.org|^(https?:)?\/*([a-z][a-z].)?wikipedia\.org",
				cls: 		VCO.Media.Wikipedia
			},
			{
				type: 		"spotify",
				name: 		"spotify",
				match_str: 	"spotify",
				cls: 		VCO.Media.Spotify
			},
			{
				type: 		"iframe",
				name: 		"iFrame",
				match_str: 	"iframe",
				cls: 		VCO.Media.IFrame
			},
			{
				type: 		"storify",
				name: 		"Storify",
				match_str: 	"storify",
				cls: 		VCO.Media.Storify
			},
			{
				type: 		"blockquote",
				name: 		"Quote",
				match_str: 	"blockquote",
				cls: 		VCO.Media.Blockquote
			},
			{
				type: 		"website",
				name: 		"Website",
				match_str: 	"http://",
				cls: 		VCO.Media.Website
			},
			{
				type: 		"imageblank",
				name: 		"Imageblank",
				match_str: 	"",
				cls: 		VCO.Media.Image
			}
		];
	
	for (var i = 0; i < media_types.length; i++) {
		if (m instanceof Array) {
			return media = {
				type: 		"slider",
				cls: 		VCO.Media.Slider
			};
		} else if (m.url.match(media_types[i].match_str)) {
			media 		= media_types[i];
			return media;
		}
	};
	
	return false;
	
}
