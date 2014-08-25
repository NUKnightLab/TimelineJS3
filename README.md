#TimelineJS3
===========

TimelineJS v3: A Storytelling Timeline built in JavaScript.  http://timeline.knightlab.com

## Getting Started
1.	Include CSS file(s) in the head of your page.
	` <link rel="stylesheet" href="css/timeline.css">`
	
	Include any font files
	`<link rel="stylesheet" href="css/fonts/font.default.css?v1">`
2.	Add a `div` to the body that will contain your timeline. The div should have a unique `id`.
3. 	Include the JS file at the bootom of the page right before the `</body>` closes.
	`<script src="js/timeline.js"></script>`
4.	After you include the timeline.js file, create an instance of timeline and link to your timeline data file and include any config options you want to use.
	``
		<script>
			var timeline = new VCO.Timeline('id_of_your_timeline_div', 'your_data_file.json', options);
		</script>
	``
5.	To handle browser resizing include a `window.onresize` event handler telling timeline to update it's display
	``
		<script>
			var timeline = new VCO.Timeline('id_of_your_timeline_div', 'your_data_file.json', options);
			window.onresize = function(event) {
				timeline.updateDisplay();
			}
		</script>
	``
	

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
		ease: 						VCO.Ease.easeInOutQuint,
		// interaction
		dragging: 					true,
		trackResize: 				true,
		map_type: 					"stamen:toner-lite",
		slide_padding_lr: 			100, 			// padding on slide of slide
		slide_default_fade: 		"0%", 			// landscape fade

		api_key_flickr: 			"", 			// Flickr API Key
		language:               	"en"		
	};

## API
### Methods
* **`timelineobj.goToId("idname")`** Go to a specific ID

###Events
* **`change`** returns `uniqueid` which is the `current_id` when the current slide changes.
* **`dataloaded`** fires when the data is loaded and TimelineJS is ready to render
* **`loaded`** fires when TimelineJS is loaded and ready 
* **`back_to_start`** fires when back to start button is activated. returns `uniqueid` which is the `current_id` when the current slide changes.
* **`zoom_in`** fires when timeline zooms in. returns `zoom_level`
* **`zoom_out`** fires when timeline zooms out. returns `zoom_level`
* **`hash_updated`** fires when hash bookmark is updated returns `uniqueid` and `hashbookmark` name
	
