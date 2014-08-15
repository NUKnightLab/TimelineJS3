TimelineJS3
===========

TimelineJS v3: A Storytelling Timeline built in JavaScript.  http://timeline.knightlab.com

## API
	`timelineobj.goToId("idname")`
## Options
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
			// animation
			duration: 					1000,
			ease: 						VCO.Ease.easeInOutQuint,
			// interaction
			dragging: 					true,
			trackResize: 				true,
			map_type: 					"stamen:toner-lite",
			slide_padding_lr: 			100, 			// padding on slide of slide
			slide_default_fade: 		"0%", 			// landscape fade

			api_key_flickr: 			"f2cc870b4d233dd0a5bfe73fd0d64ef0",
			language:               	"en"		
		};
