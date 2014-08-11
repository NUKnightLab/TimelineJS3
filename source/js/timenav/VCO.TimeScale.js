/*  VCO.TimeScale
    Strategies for laying out the timenav
    make a new one if the slides change

    TODOS: deal with clustering 
================================================== */
VCO.TimeScale = VCO.Class.extend({
    
    initialize: function (slides, display_width, screen_multiplier) {
        this._screen_multiplier = screen_multiplier || 3;
		
        this.slides = slides; // didn't want to hold on to this, but will need to recompute numberOfRows if display width changes.
		this._pixels_per_milli = 0;
        this.axis_helper = null;
		this._number_of_rows = 2;
		
        this._earliest = slides[0].start_date.data.date_obj.getTime();
        // TODO: should _latest be the end date if there is one?
        this._latest = slides[slides.length - 1].start_date.data.date_obj.getTime();
        this._span_in_millis = this._latest - this._earliest;
        this._average = (this._span_in_millis)/slides.length;

        display_width = display_width || 500; //arbitrary default
        this.setDisplayWidth(display_width);
    },
    
    getNumberOfRows: function() {
        return this._number_of_rows
    },

    setDisplayWidth: function(display_width) {
        this._display_width = display_width; // arbitrary. better default?
        var pixel_width = this._screen_multiplier * this._display_width;
        this._pixels_per_milli = pixel_width / this._span_in_millis;
        this._axis_helper = VCO.AxisHelper.getBestHelper(this);
        var pad_pixels = display_width * this.getPixelsPerTick(); // .5 width before & .5 after
        this._scale_width = pad_pixels + pixel_width;
        this._number_of_rows = this._computeNumberOfRows();
    },

    getPosition: function(time_in_millis) {
        return ( time_in_millis - this._earliest ) * this._pixels_per_milli
    },

    getPixelsPerTick: function() {
        return this._axis_helper.getPixelsPerTick(this._pixels_per_milli);
    },

    getMajorTicks: function() {
        return this._axis_helper.getMajorTicks(this);
    },

    getMinorTicks: function() {
        return this._axis_helper.getMinorTicks(this);
    },

    getMajorScale: function() {
        return this._axis_helper.major.name;
    },
    
    getMinorScale: function() {
        return this._axis_helper.minor.name;
    },

    _computeNumberOfRows: function(default_marker_width) { // default_marker_width should be in pixels
        default_marker_width = default_marker_width || 100;
        var pixel_widths = [];
        for (var i = 0; i < this.slides.length; i++) {
            // TODO this won't work on cosmological scale
            var l = this.getPosition(this.slides[i].start_date.data.date_obj.getTime());
            pixel_widths.push([l,l+default_marker_width]);
        };
        window.pixel_widths = pixel_widths;
        return VCO.Util.maxDepth(pixel_widths);
    },

    eventsOverlap: function(e1, e2) { /* events should be JS objects with e.start and e.end properties which should be VCO.Date objects */
        
    }
    
});
