#TimelineJS3
============

TimelineJS v3: A Storytelling Timeline built in JavaScript.  http://timeline.knightlab.com

## Overview

TimelineJS 3 is a rewrite of the popular Timeline JS software. Please be clear that this is software which "does" the same thing, but it isn't the same software, so some details will vary. See http://timeline.knightlab.com for more information.

## Getting Started
Include CSS file(s) in the head of your page.
```
<link rel="stylesheet" href="css/timeline.css">
```
Include any font files
```
<link rel="stylesheet" href="css/fonts/font.default.css?v1">
```
Add a `div` to the body that will contain your timeline. The div should have a unique `id`.
Include the JS file at the bootom of the page right before the `</body>` closes.
```
<script src="js/timeline.js"></script>
```
After you include the timeline.js file, create an instance of timeline and link to your timeline data file and include any config options you want to use.
```
<script>
	var timeline = new TL.Timeline('id_of_your_timeline_div', 'your_data_file.json', options);
</script>
```
To handle browser resizing include a `window.onresize` event handler telling timeline to update it's display
```
<script>
	var timeline = new TL.Timeline('id_of_your_timeline_div', 'your_data_file.json', options);
	window.onresize = function(event) {
		timeline.updateDisplay();
	}
</script>
```
	

## Options
TODO: Need to document this in a better format
	
	this.options = {
		script_path: 				"",
		height: 					this._el.container.offsetHeight,
		width: 						this._el.container.offsetWidth,
		scale_factor: 				3, 				// How many screen widths wide should the timeline be
		layout: 					"landscape", 	// portrait or landscape
		timenav_position: 			"bottom", 		// timeline on top or bottom
		optimal_tick_width: 		100,			// optimal distance (in pixels) between ticks on axis
		base_class: 				"",
		timenav_height: 			150,
		timenav_height_percentage: 	25,				// Overrides timenav height as a percentage of the screen
		timenav_height_min: 		150, 			// Minimum timenav height
		marker_height_min: 			30, 			// Minimum Marker Height
		marker_width_min: 			100, 			// Minimum Marker Width
		marker_padding: 			5,				// Top Bottom Marker Padding
		start_at_slide: 			0,
		menubar_height: 			0,
		skinny_size: 				650,
		relative_date: 				false, 			// Use momentjs to show a relative date from the slide.text.date.created_time field
		use_bc: 					false, 			// Use declared suffix on dates earlier than 0
		// animation
		duration: 					1000,
		ease: 						TL.Ease.easeInOutQuint,
		// interaction
		dragging: 					true,
		trackResize: 				true,
		map_type: 					"stamen:toner-lite",
		slide_padding_lr: 			100, 			// padding on slide of slide
		slide_default_fade: 		"0%", 			// landscape fade

		api_key_flickr: 			"", 			// Flickr API Key
		language:               	"en"		
	};

## Data file
The data file should be in JSON format with the following structure

```
{
	"title": {
			"media": {
				"caption": 	    "",
				"credit": 	    "",
				"url": 		    "url_to_your_media.jpg",
				"thumbnail":    "url_to_your_media.jpg"
			},
			"text": {
				"headline": "Headline Goes Here",
				"text": 	"Your slide text goes here."
			}
	},
	"events": [
		{
			"start_date": {
				"year":			"1900",
				"month":		"01",
				"day": 			"05",
				"hour": 		"",
				"minute": 		"",
				"second": 		"",
				"millisecond": 	"",
				"format": 		""
			},
                	"end_date": {
				"year":			"1900",
				"month":		"06",
				"day": 			"07",
				"hour": 		"",
				"minute": 		"",
				"second": 		"",
				"millisecond": 	"",
				"format": 		""
			},
			"media": {
				"caption": 	    "",
				"credit": 	    "",
				"url": 		    "url_to_your_media.jpg",
				"thumbnail": 	"url_to_your_media.jpg"
			},
			"text": {
				"headline": "Headline Goes Here",
				"text": 	"Your slide text goes here."
			}
		}
	]
}
```
## API
See API doc here: https://github.com/NUKnightLab/TimelineJS3/blob/master/API.md

## Media Types
We support the following media types
* Flickr
* Instagram
* Images
* Vimeo
* YouTube
* Vine
* Daily Motion
* Soundcloud
* Spotify
* Storify
* Document Cloud
* Google Maps
* Google Docs
* iFrames
* Blockquotes
* Twitter
* Website Links

### Extending Media Types
* Create a new class for the media type in `source/js/media/type`. It's easiest to duplicate an existing one and change the filename and classname.
* Add the new file to the code-kit compile list inside the main `TL.Timeline.js` file. Code-kit uses the following language to prepend the file to the compile `// @codekit-prepend "media/types/TL.Media.YourMediaTypeName.js";`
* Add a new object to the `media_types` array in `source/js/media/TL.MediaType.js`. Make sure to have the correct class name in `cls` and use `match_str` as a regex to help timeline figure out what type of media the given url is.
* If you want icons for the media to show up in the Timeline, then you will also need to add an icon class to `source/less/icons/Icons.less` that has the name `.tl-icon-yourmediatypename`. 

