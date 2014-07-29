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
				match_str: 	"(www.)?youtube|youtu\.be",
				cls: 		VCO.Media.YouTube
			},
			{
				type: 		"vimeo",
				name: 		"Vimeo", 
				match_str: 	"(player.)?vimeo\.com",
				cls: 		VCO.Media.Vimeo
			},
			{
				type: 		"dailymotion",
				name: 		"DailyMotion", 
				match_str: 	"(www.)?dailymotion\.com",
				cls: 		VCO.Media.DailyMotion
			},
			{
				type: 		"vine",
				name: 		"Vine", 
				match_str: 	"(www.)?vine\.co",
				cls: 		VCO.Media.Vine
			},
			{
				type: 		"soundcloud",
				name: 		"SoundCloud", 
				match_str: 	"(player.)?soundcloud\.com",
				cls: 		VCO.Media.SoundCloud
			},
			{
				type: 		"twitter",
				name: 		"Twitter", 
				match_str: 	"(www.)?twitter\.com",
				cls: 		VCO.Media.Twitter
			},
			{
				type: 		"googlemaps",
				name: 		"Google Map", 
				match_str: 	"maps.google",
				cls: 		VCO.Media.Map
			},
			{
				type: 		"googleplus",
				name: 		"Google+", 
				match_str: 	"plus.google",
				cls: 		VCO.Media.GooglePlus
			},
			{
				type: 		"flickr",
				name: 		"Flickr", 
				match_str: 	"flickr.com/photos",
				cls: 		VCO.Media.Flickr
			},
			{
				type: 		"instagram",
				name: 		"Instagram", 
				match_str: 	/(instagr.am|instagram.com)\/p\//,
				cls: 		VCO.Media.Instagram
			},
			{
				type: 		"profile",
				name: 		"Profile", 
				match_str: 	/((instagr.am|instagram.com)(\/profiles\/|[-a-zA-Z0-9@:%_\+.~#?&//=]+instagramprofile))|[-a-zA-Z0-9@:%_\+.~#?&//=]+\?profile/,
				cls: 		VCO.Media.Profile
			},
			{
				type: 		"image",
				name: 		"Image",
				match_str: 	/jpg|jpeg|png|gif/i,
				cls: 		VCO.Media.Image
			},
			{
				type: 		"googledocs",
				name: 		"Google Doc",
				match_str: 	/\b.(doc|docx|xls|xlsx|ppt|pptx|pdf|pages|ai|psd|tiff|dxf|svg|eps|ps|ttf|xps|zip|tif)\b/,
				cls: 		VCO.Media.GoogleDoc
			},
			{
				type: 		"wikipedia",
				name: 		"Wikipedia",
				match_str: 	"(www.)?wikipedia\.org",
				cls: 		VCO.Media.Wikipedia
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
				type: 		"",
				name: 		"",
				match_str: 	"",
				cls: 		VCO.Media
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
			media.url 	= m.url;
			return media;
			break;
		}
	};
	
	return false;
	
}
