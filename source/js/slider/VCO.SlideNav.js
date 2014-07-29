/*	VCO.SlideNav
	Navigation for Slideshows
================================================== */
// TODO null out data

VCO.SlideNav = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
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
			description: "Description"
		};
	
		//Options
		this.options = {
			direction: 			"previous"
		};
	
		this.animator = null;
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		VCO.Util.mergeData(this.data, data);
		
		
		this._el.container = VCO.Dom.create("div", "vco-slidenav-" + this.options.direction);
		
		if (VCO.Browser.mobile) {
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
	update: function(d) {
		this._update(d);
	},
	
	/*	Color
	================================================== */
	setColor: function(inverted) {
		if (inverted) {
			this._el.content_container.className = 'vco-slidenav-content-container vco-slidenav-inverted';
		} else {
			this._el.content_container.className = 'vco-slidenav-content-container';
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
		this.data = VCO.Util.mergeData(this.data, d);
		
		// Title
		if (this.data.title != "") {
			this._el.title.innerHTML		= this.data.title;
		}
		
		// Date
		if (this.data.date != "") {
			this._el.description.innerHTML	= this.data.description;
		}
	},
	
	_initLayout: function () {
		
		// Create Layout
		this._el.content_container			= VCO.Dom.create("div", "vco-slidenav-content-container", this._el.container);
		this._el.icon						= VCO.Dom.create("div", "vco-slidenav-icon", this._el.content_container);
		this._el.title						= VCO.Dom.create("div", "vco-slidenav-title", this._el.content_container);
		this._el.description				= VCO.Dom.create("div", "vco-slidenav-description", this._el.content_container);
		
		this._el.icon.innerHTML				= "&nbsp;"
		
		this._update();
	},
	
	_initEvents: function () {
		VCO.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
});