/*  VCO.TimeScale
    Strategies for laying out the timenav
    make a new one if the slides change

    TODOS: deal with clustering 
================================================== */
VCO.TimeScale = VCO.Class.extend({
    
    initialize: function (slides, display_width, screen_multiplier) {
        this._screen_multiplier = screen_multiplier || 3;
        
        this.slides = slides; // didn't want to hold on to this, but will need to recompute numberOfRows if display width changes.
        this._positions = [];
        this._pixels_per_milli = 0;
        this.axis_helper = null;
        this._number_of_rows = 2;
        
        this._earliest = slides[0].start_date.getTime();
        // TODO: should _latest be the end date if there is one?
        this._latest = slides[slides.length - 1].start_date.getTime();
        this._span_in_millis = this._latest - this._earliest;
        this._average = (this._span_in_millis)/slides.length;

        display_width = display_width || 500; //arbitrary default

        this._display_width = display_width; // arbitrary. better default?
        var pixel_width = this._screen_multiplier * this._display_width;
        this._pixels_per_milli = pixel_width / this._span_in_millis;
        this._axis_helper = VCO.AxisHelper.getBestHelper(this);
        var pad_pixels = display_width * this.getPixelsPerTick(); // .5 width before & .5 after
        this._scale_width = pad_pixels + pixel_width;
        this._number_of_rows = this._computeNumberOfRows();
        this._computePositionInfo(slides);
    },
    
    getNumberOfRows: function() {
        return this._number_of_rows
    },

    getPosition: function(time_in_millis) {
        return ( time_in_millis - this._earliest ) * this._pixels_per_milli
    },

    getPositionInfo: function(idx) {
        return this._positions[idx];
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
            var l = this.getPosition(this.slides[i].start_date.getTime());
            pixel_widths.push([l,l+default_marker_width]);
        };
        window.pixel_widths = pixel_widths;
        return VCO.Util.maxDepth(pixel_widths);
    },

    _computePositionInfo: function(slides,default_marker_width) { // default_marker_width should be in pixels
        default_marker_width = default_marker_width || 100;
        var lasts_in_rows = []; 

        for (var i = 0; i < slides.length; i++) {
            var pos_info = { start: this.getPosition(slides[i].start_date.getTime()) }
            this._positions.push(pos_info);
            if (typeof(slides[i].end_date) != 'undefined') {
                var end_pos = this.getPosition(slides[i].end_date.getTime());
                pos_info.width = end_pos - pos_info.start;
                if (pos_info.width > default_marker_width) {
                    pos_info.end = pos_info.start + pos_info.width; 
                } else {
                    pos_info.end = pos_info.start + default_marker_width; 
                }
            } else {
                pos_info.width = default_marker_width;
                pos_info.end = pos_info.start + default_marker_width;
            }
        };

        for (var i = 0; i < this._positions.length; i++) {
            var pos_info = this._positions[i];
            for (var j = 0; j < lasts_in_rows.length; j++) {
                console.log("slide " + i + " new start: " + pos_info.start + " >? row " + j + " end: " + lasts_in_rows[j].end);
                console.log("boolean:",(pos_info.start > lasts_in_rows[j].end))
                if (pos_info.start > lasts_in_rows[j].end) {
                    pos_info.row = j;
                    lasts_in_rows[j] = pos_info;
                    console.log("put slide " + i + " in row " + j)
                    break;
                }
            };
            if (typeof(pos_info.row) == 'undefined') {
                console.log("need a new row for slide " + i);
                pos_info.row = lasts_in_rows.length;
                lasts_in_rows.push(pos_info);
            }

        };
        return lasts_in_rows.length;
        
    }
    
});
