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

    roundDown: function(date,scale) { // given a date, return the tick closest to it on 'scale' without going over (that is, scale should be 'major' or 'minor')
        if (scale != 'minor' && scale != 'major') throw("Invalid scale");

    },

    _getTicks: function(timescale, option) {
        var ticks = []
        console.log(option);
        console.log(timescale);
        for (var i = timescale._earliest; i < timescale._latest; i += option.factor) {
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
        ['millisecond',1, function(d) { }],
        ['second',1000, function(d) { d.setMilliseconds(0);}],
        ['minute',1000 * 60, function(d) { d.setSeconds(0);}],
        ['hour',1000 * 60 * 60, function(d) { d.setMinutes(0);}],
        ['day',1000 * 60 * 60 * 24, function(d) { d.setHours(0);}],
        ['month',1000 * 60 * 60 * 24 * 30, function(d) { d.setDate(1);}],
        ['year',1000 * 60 * 60 * 24 * 365, function(d) { d.setMonth(0);}],
        ['decade',1000 * 60 * 60 * 24 * 365 * 10, function(d) { 
            var real_year = 1900 + d.getYear();
            d.setYear( real_year - (real_year % 10)) 
        }],
        ['century',1000 * 60 * 60 * 24 * 365 * 100, function(d) { 
            var real_year = 1900 + d.getYear();
            d.setYear( real_year - (real_year % 100)) 
        }],
        ['millennium',1000 * 60 * 60 * 24 * 365 * 1000, function(d) { 
            var real_year = 1900 + d.getYear();
            d.setYear( real_year - (real_year % 1000)) 
        }],
        // Javascript dates only go from -8640000000000000 millis to 8640000000000000 millis
        // or 271,821 BCE to 275,760 CE so as long as we do this with JS dates, the following
        // scales are not relevant
        // ['age',1000 * 60 * 60 * 24 * 365 * 1000000, function(d) { }],    // 1M years
        // ['epoch',1000 * 60 * 60 * 24 * 365 * 10000000, function(d) { }], // 10M years
        // ['era',1000 * 60 * 60 * 24 * 365 * 100000000, function(d) { }],  // 100M years
        // ['eon',1000 * 60 * 60 * 24 * 365 * 500000000, function(d) { }]  //500M years
    ]

    cls.SCALES = SCALES;

    cls.floor = function(date, scale) {
        var d = new Date(date);
        for (var i = 0; i < SCALES.length; i++) {
            SCALES[i][2](d);
            if (SCALES[i][0] == scale) return d;
        };
        throw('invalid scale');
    }

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
