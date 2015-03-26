/*	VCO.TimeGroup
	
================================================== */
 
VCO.TimeGroup = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(group_name) {
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			message_container: {},
			loading_icon: {},
			message: {}
		};
		
		this.group_name = group_name;
		//Options
		this.options = {
			width: 					600,
			height: 				600
		};
		
		// Merge Data and Options
		//VCO.Util.mergeData(this.data, data);
		//VCO.Util.mergeData(this.options, options);
		
		this._el.container = VCO.Dom.create("div", "vco-timegroup");
		this._el.container.innerHTML = "<h1>" + this.group_name + "</h1>";
		
		
		// Animation
		this.animator = {};
		
		
		this._initLayout();
		this._initEvents();
	},
	
	/*	Public
	================================================== */
	
	
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h) {
		
	},
	

	/*	Events
	================================================== */

	
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		//this._el.message_container = VCO.Dom.create("div", "vco-message-container", this._el.container);
		//this._el.loading_icon = VCO.Dom.create("div", this.options.message_icon_class, this._el.message_container);
		//this._el.message = VCO.Dom.create("div", "vco-message-content", this._el.message_container);
		
		
		
	},
	
	_initEvents: function () {
		VCO.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	},
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
	}
	
});