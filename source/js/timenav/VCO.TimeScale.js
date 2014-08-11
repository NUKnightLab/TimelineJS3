/*  VCO.TimeScale
    Strategies for laying out the timenav
    make a new one if the slides change

    TODOS: deal with clustering 
================================================== */
VCO.TimeScale = VCO.Class.extend({
    
    initialize: function (slides, pixel_width) {
        if (pixel_width == null) { pixel_width = 0; };
		
		this.pixels_per_milli = 0;
        this.axis_helper = null;
		this.number_of_rows = 2;
		
        this.earliest = slides[0].date.data.date_obj.getTime();
        this.latest = slides[slides.length - 1].date.data.date_obj.getTime();
        this.span_in_millis = this.latest - this.earliest;
        this.average = (this.span_in_millis)/slides.length;

        this.setPixelWidth(pixel_width);
    },
    
    setPixelWidth: function(width) {
        this.pixel_width = width;
        this.pixels_per_milli = this.pixel_width / this.span_in_millis; 
        this.axis_helper = VCO.AxisHelper.getBestHelper(this);
    },

    getPosition: function(time_in_millis) {
        return ( time_in_millis - this.earliest ) * this.pixels_per_milli
    },

    getPixelsPerTick: function(timescale) {
        return this.axis_helper.getPixelsPerTick(this);
    },

    getMajorTicks: function(timescale) {
        return this.axis_helper.getMajorTicks(this);
    },

    getMinorTicks: function(timescale) {
        return this.axis_helper.getMinorTicks(this);
    },

    
});
