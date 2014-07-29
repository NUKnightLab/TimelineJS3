/*	VCO.MapMarker
	Creates a marker. Takes a data object and
	populates the marker with content.
================================================== */

VCO.MapMarker = VCO.Class.extend({
	
	includes: [VCO.Events],
	
	/*	Constructor
	================================================== */
	initialize: function(data, options) {
		
		// DOM Elements
		this._el = {
			container: {},
			content_container: {},
			content: {}
		};
	
		// Components
		this._marker = {};
		
		// Icon
		this._icon = {};
		this._custom_icon = false;
		this._custom_icon_url = "";
		this._custom_image_icon = false;
		
		// Marker Number
		this.marker_number = 0;
		
		// Media Icon
		this.media_icon_class = "";
		
		// Timer
		this.timer = {};
	
		// Data
		this.data = {};
	
		// Options
		this.options = {
			// animation
			duration: 			1000,
			ease: 				VCO.Ease.easeInSpline,
			width: 				600,
			height: 			600,
			map_popup: 			false,
			use_custom_markers: false
		};
		
		
		// Animation Object
		this.animator = null;
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		VCO.Util.mergeData(this.data, data);
		
		this._initLayout();
		
		
	},
	
	/*	Public
	================================================== */
	show: function() {
		
	},
	
	hide: function() {
		
	},
	
	addTo: function(m) {
		this._addTo(m);
	},
	
	removeFrom: function(m) {
		this._removeFrom(m)
	},
	
	updateDisplay: function(w, h, a) {
		this._updateDisplay(w, h, a);
	},
	
	createMarker: function(d, o) {
		this._createMarker(d, o);
	},
	
	createPopup: function(d, o) {
		this._createPopup(d, o);
	},
	
	active: function(a) {
		this._active(a);
	},
	
	location: function() {
		return this._location();
	},
	
	/*	Marker Specific
		Specific to Map API
	================================================== */
		_createMarker: function(d, o) {
			
		},
		
		_addTo: function(m) {
			
		},
		
		_removeFrom: function(m) {
			
		},
		
		_createPopup: function(d, o) {
		
		},
		
		_active: function(a) {
			
		},
		
		_location: function() {
			return {lat:0, lng:0}
		},
	
	/*	Events
	================================================== */
	_onMarkerClick: function(e) {
		this.fire("markerclick", {marker_number: this.marker_number});
	},
	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		this._createMarker(this.data, this.options);
	},
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
	}
	
});
