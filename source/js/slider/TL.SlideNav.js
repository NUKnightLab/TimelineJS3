/*	TL.SlideNav
	encapsulate DOM display/events for the 
	'next' and 'previous' buttons on a slide.
================================================== */
// TODO null out data

TL.SlideNav = TL.Class.extend({
	
	includes: [TL.Events, TL.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			content_container: {},
			icon: {},
			title: {},
			description: {}
		};
	
		// Media Type
		this.mediatype = {};
		
		// Data
		this.data = {
			title: "Navigation",
			description: "Description",
			date: "Date"
		};
	
		//Options
		this.options = {
			direction: 			"previous"
		};
	
		this.animator = null;
		
		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		TL.Util.mergeData(this.data, data);
		
		
		this._el.container = TL.Dom.create("div", "tl-slidenav-" + this.options.direction);
		
		if (TL.Browser.mobile) {
			this._el.container.setAttribute("ontouchstart"," ");
		}
		
		this._initLayout();
		this._initEvents();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	},
	
	/*	Update Content
	================================================== */
	update: function(slide) {
		var d = {
			title: "",
			description: "",
			date: slide.getFormattedDate()
		};
		
		if (slide.data.text) {
			if (slide.data.text.headline) {
				d.title = slide.data.text.headline;
			}
		}

		this._update(d);
	},
	
	/*	Color
	================================================== */
	setColor: function(inverted) {
		if (inverted) {
			this._el.content_container.className = 'tl-slidenav-content-container tl-slidenav-inverted';
		} else {
			this._el.content_container.className = 'tl-slidenav-content-container';
		}
	},
	
	/*	Events
	================================================== */
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},
	
	/*	Private Methods
	================================================== */
	_update: function(d) {
		// update data
		this.data = TL.Util.mergeData(this.data, d);
		
		// Title
		this._el.title.innerHTML = TL.Util.unlinkify(this.data.title);
		
		// Date
		this._el.description.innerHTML	= TL.Util.unlinkify(this.data.date);
	},
	
	_initLayout: function () {
		
		// Create Layout
		this._el.content_container			= TL.Dom.create("div", "tl-slidenav-content-container", this._el.container);
		this._el.icon						= TL.Dom.create("div", "tl-slidenav-icon", this._el.content_container);
		this._el.title						= TL.Dom.create("div", "tl-slidenav-title", this._el.content_container);
		this._el.description				= TL.Dom.create("div", "tl-slidenav-description", this._el.content_container);
		
		this._el.icon.innerHTML				= "&nbsp;"
		
		this._update();
	},
	
	_initEvents: function () {
		TL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
});