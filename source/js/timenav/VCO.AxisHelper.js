/*  VCO.AxisHelper
    Strategies for laying out the timenav
    markers and time axis
================================================== */
VCO.AxisHelper = VCO.Class.extend({
    initialize: function (options) {
        this.minor = options.minor;
        this.major = options.major;
    },
    
    getPixelsPerTick: function(timescale) {
        return timescale.pixels_per_milli * this.minor.factor;
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
    MILLIS_PER_UNIT = {
        millisecond: 1,
        second: 1000,
        minute: 1000 * 60,
        hour: 1000 * 60 * 60,
        day: 1000 * 60 * 60 * 24,
        month: 1000 * 60 * 60 * 24 * 30,
        year: 1000 * 60 * 60 * 24 * 365,
        decade: 1000 * 60 * 60 * 24 * 365 * 10,
        century: 1000 * 60 * 60 * 24 * 365 * 100,
        millenium: 1000 * 60 * 60 * 24 * 365 * 1000,
        age: 1000 * 60 * 60 * 24 * 365 * 1000000,    // 1M years
        epoch: 1000 * 60 * 60 * 24 * 365 * 10000000, // 10M years
        era: 1000 * 60 * 60 * 24 * 365 * 100000000,  // 100M years
        eon: 1000 * 60 * 60 * 24 * 365 * 500000000   //500M years
    }

    SCALES = ["millisecond", "second", "minute", "hour", "day", "month", "year", "decade", "century", "millenium", "age", "epoch", "era"]

    HELPERS = [];
    for (var idx = 0; idx < SCALES.length - 2; idx++) {
        var minor_name = SCALES[idx];
        var major_name = SCALES[idx+1];
        HELPERS.push(new cls({
            minor: { name: minor_name, factor: MILLIS_PER_UNIT[minor_name]},
            major: { name: major_name, factor: MILLIS_PER_UNIT[major_name]}
        }));
    }

    cls.getBestHelper = function(ts,optimal_tick_width) {
        if (typeof(optimal_tick_width) != 'number' ) {
            optimal_tick_width = 100;
        }
        var prev = null;
        for (var idx in HELPERS) {
            var curr = HELPERS[idx];
            trace(curr.minor.name);
            trace(curr.getPixelsPerTick(ts));
            if (curr.getPixelsPerTick(ts) > optimal_tick_width)  {
                if (prev == null) return curr;
                var curr_dist = Math.abs(optimal_tick_width - curr.getPixelsPerTick(ts));
                var prev_dist = Math.abs(optimal_tick_width - curr.getPixelsPerTick(ts));
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
})(VCO.AxisHelper)
