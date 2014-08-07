/*  VCO.TimeScale
    Strategies for laying out the timenav
    make a new one if the slides change

    TODOS: deal with clustering 
================================================== */
VCO.TimeScale = VCO.Class.extend({
    
    initialize: function (slides, display_width, screen_multiplier) {
        this._screen_multiplier = screen_multiplier || 3;
		
		this._pixels_per_milli = 0;
        this._axis_helper = null;
		
        this._earliest = slides[0].date.data.date_obj.getTime();
        this._latest = slides[slides.length - 1].date.data.date_obj.getTime();
        this._span_in_millis = this._latest - this._earliest;
        this._average = (this._span_in_millis)/slides.length;

        display_width = display_width || 500; //arbitrary default
        this.setDisplayWidth(display_width);
    },
    
    setDisplayWidth: function(display_width) {
        this._display_width = display_width; // arbitrary. better default?
        var pixel_width = this._screen_multiplier * this._display_width;
        this._pixels_per_milli = pixel_width / this._span_in_millis;
        this._axis_helper = VCO.AxisHelper.getBestHelper(this);
        var pad_pixels = display_width * this.getPixelsPerTick(); // .5 width before & .5 after
        this._scale_width = pad_pixels + pixel_width;
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
    }
    
});
