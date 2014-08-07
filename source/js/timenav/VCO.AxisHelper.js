/*  VCO.AxisHelper
    Strategies for laying out the timenav
    markers and time axis
    Intended as a private class -- probably only known to TimeScale
================================================== */
VCO.AxisHelper = VCO.Class.extend({
    initialize: function (options) {
		if (options) {
	        this.minor = options.minor;
	        this.major = options.major;
		} else {
            throw("Axis helper must be configured with options")
        }
       
    },
    
    getPixelsPerTick: function(pixels_per_milli) {
        return pixels_per_milli * this.minor.factor;
    },

    getMajorTicks: function(timescale) {
		return this._getTicks(timescale, this.major)
    },

    getMinorTicks: function(timescale) {
        return this._getTicks(timescale, this.minor)
    },

    _getTicks: function(timescale, option) {
        var ticks = []
        for (var i = timescale.earliest; i < timescale.latest; i += option.factor) {
            ticks.push(new VCO.Date(i));
        }
        return {
            name: option.name,
            ticks: ticks
        }

    }

});

(function(cls){ // add some class-level behavior

    SCALES = [ // ( name, millis_per_tick )
        ['millisecond',1],
        ['second',1000],
        ['minute',1000 * 60],
        ['hour',1000 * 60 * 60],
        ['day',1000 * 60 * 60 * 24],
        ['month',1000 * 60 * 60 * 24 * 30],
        ['year',1000 * 60 * 60 * 24 * 365],
        ['decade',1000 * 60 * 60 * 24 * 365 * 10],
        ['century',1000 * 60 * 60 * 24 * 365 * 100],
        ['millenium',1000 * 60 * 60 * 24 * 365 * 1000],
        ['age',1000 * 60 * 60 * 24 * 365 * 1000000],    // 1M years
        ['epoch',1000 * 60 * 60 * 24 * 365 * 10000000], // 10M years
        ['era',1000 * 60 * 60 * 24 * 365 * 100000000],  // 100M years
        ['eon',1000 * 60 * 60 * 24 * 365 * 500000000]  //500M years
    ]

    HELPERS = [];
    for (var idx = 0; idx < SCALES.length - 2; idx++) {
        var minor = SCALES[idx];
        var major = SCALES[idx+1];
        HELPERS.push(new cls({
            minor: { name: minor[0], factor: minor[1]},
            major: { name: major[0], factor: major[1]}
        }));
    }

    cls.getBestHelper = function(ts,optimal_tick_width) {
        if (typeof(optimal_tick_width) != 'number' ) {
            optimal_tick_width = 100;
        }
        var prev = null;
        for (var idx in HELPERS) {
            var curr = HELPERS[idx];
            var pixels_per_tick = curr.getPixelsPerTick(ts._pixels_per_milli);
            if (pixels_per_tick > optimal_tick_width)  {
                if (prev == null) return curr;
                var curr_dist = Math.abs(optimal_tick_width - pixels_per_tick);
                var prev_dist = Math.abs(optimal_tick_width - pixels_per_tick);
                if (curr_dist < prev_dist) {
                    return curr;
                } else {
                    return prev;
                }
            }
            prev = curr;
        }
        return HELPERS[HELPERS.length - 1]; // last resort           
    }
})(VCO.AxisHelper);
