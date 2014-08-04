TimelineJS3
===========

TimelineJS v3: A Storytelling Timeline built in JavaScript.  http://timeline.knightlab.com

## API
	`timelineobj.goToId("idname")`
## Options
		this.options = {
			script_path:            "",
			height: 				this._el.container.offsetHeight,
			width: 					this._el.container.offsetWidth,
			layout: 				"landscape", 	// portrait or landscape
			timenav_position: 		"bottom", 		// timeline on top or bottom
			base_class: 			"",
			timenav_height: 		300,
			start_at_slide: 		0,
			menubar_height: 		0,
			skinny_size: 			650,
			relative_date: 			false, 			// Use momentjs to show a relative date from the slide.text.date.created_time field
			// animation
			duration: 				1000,
			ease: 					VCO.Ease.easeInOutQuint,
			// interaction
			dragging: 				true,
			trackResize: 			true,
			map_type: 				"stamen:toner-lite",
			slide_padding_lr: 		100, 			// padding on slide of slide
			slide_default_fade: 	"0%", 			// landscape fade
			menubar_default_y: 		0,
			map_popup: 				false,
			zoom_distance: 			100,
			line_follows_path: 		true,   		// Map history path follows default line, if false it will connect previous and current only
			line_color: 			"#c34528", //"#DA0000",
			line_color_inactive: 	"#CCC",
			line_join: 				"miter",
			line_weight: 			3,
			line_opacity: 			0.80,
			line_dash: 				"5,5",
			api_key_flickr: 		"f2cc870b4d233dd0a5bfe73fd0d64ef0",
			language:               "en"		
		};
