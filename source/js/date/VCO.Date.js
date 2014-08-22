/*	VCO.Date
	Date object
	MONTHS are 1-BASED, not 0-BASED (different from Javascript date objects)
================================================== */
VCO.Date = VCO.Class.extend({
    /*Initialize with a time value (in milliseconds), a JavaScript Date object,
     * or a JS dictionary with properties for year, month, day, etc. */	
	initialize: function (data, format, format_short) {
		if (typeof(data) == 'number' || Date == data.constructor) {
			var date = null;
			if (Date == data.constructor) {
				date = data;
			} else {
				date = new Date(data);
			}
			this.data = {
                scale:          "javascript",
				format: 		"yyyy mmmm",
				date_obj: 		date
			}
		} else if (VCO.BigYear == data.constructor) {
            this.data = {
                scale:          "cosmological",
                date_obj:       data
            }
		} else {
			this.data = {
				year: 			"",
				month: 			"",
				day: 			"",
				hour: 			"",
				minute: 		"",
				second: 		"",
				millisecond: 	"",
				format: 		"yyyy mmmm",
				format_short: 	"yyyy mmmm",
				date_obj: 		{}
			};
			
			
			// Merge Data
			VCO.Util.mergeData(this.data, data);

			// Create Date Object
			this._createDateObj();
		}
		
		if (format) {
			this.data.format = format;
		} else {
			this.data.format = VCO.DateUtil.findBestFormat(this.data);
		}
		
		if (format_short) {
			this.data.format_short = format_short;
		} else {
			this.data.format_short = VCO.DateUtil.findBestFormat(this.data, true);
		}
		
    },

    getScale: function() {
        return this.data.scale;
	},
	
	/*	Private Methods
	================================================== */
	
	/*	Create Display Type
	================================================== */
	setDateFormat: function(format) {
		// Set display type format
		this.data.format = format;
	},
	
	getDisplayDate: function(language,use_short) {
        if (language && !use_short) {
            use_short = 'short';
            language = VCO.Language.default;
        }

        if (!language) {
            language = VCO.Language.default;
        }

        if (Date == this.data.date_obj.constructor) {
            var message_key = this.data.format;
		if (use_short) {
                message_key = this.data.format_short;
            }
            return language.formatDate(this.data.date_obj,message_key);
		} else {
            if (use_short) {
                return this.data.date_obj.getDisplayTextShort(language);
		}
            return this.data.date_obj.getDisplayText(language);
        }
	},
	
	getMillisecond: function() {
		return this.getTime();
	},
	
	getTime: function() {
		return this.data.date_obj.getTime();
	},
	
	isBefore: function(other_date) { 
        if (!this.data.date_obj.constructor == other_date.data.date_obj.constructor) {
                throw("Can't compare VCO.Dates on different scales") // but should be able to compare 'cosmological scale' dates once we get to that...
        }
        if ('isBefore' in this.data.date_obj) {
            return this.data.date_obj['isBefore'](other_date.data.date_obj);
        }
        return this.data.date_obj < other_date.data.date_obj
	},

	isAfter: function(other_date) {
        if (!this.data.date_obj.constructor == other_date.data.date_obj.constructor) {
                throw("Can't compare VCO.Dates on different scales") // but should be able to compare 'cosmological scale' dates once we get to that...
        }
        if ('isAfter' in this.data.date_obj) {
            return this.data.date_obj['isAfter'](other_date.data.date_obj);
        }
        return this.data.date_obj > other_date.data.date_obj
	},

    floor: function(scale) { // more likely problems with cosmological time
    	/* Return a NEW VCO.Date which has been 'floored' at the given scale.
		   'scale' should be a string value from VCO.Date.SCALES
		   This will need to be smarter to work with cosmological dates.
    	*/
        if (this.getScale() == 'javascript') {
            var d = new Date(this.data.date_obj);
            for (var i = 0; i < VCO.Date.SCALES.length; i++) {
                if (VCO.Date.SCALES[i][3] == this.getScale()) {
                    // for JS dates, we iteratively apply flooring functions
                    VCO.Date.SCALES[i][2](d);
                    if (VCO.Date.SCALES[i][0] == scale) return new VCO.Date(d);
                }
            };
        }
        // it would be nice if there wasn't special casing here...
        if (this.getScale() == 'cosmological') {
            for (var i = 0; i < VCO.Date.SCALES.length; i++) {
                if (VCO.Date.SCALES[i][3] == this.getScale()) {
                    if (VCO.Date.SCALES[i][0] == scale) {
                        var floored = VCO.Date.SCALES[i][2](this.data.date_obj);
                        return new VCO.Date(floored);
                    }
                }
            };
        }

        throw('invalid scale ' + scale);
    },


	/*	Create JavaScript date object
	================================================== */
	_createDateObj: function() {
		var _date = {
			year: 			0,
			month: 			1, // stupid JS dates
			day: 			0,
			hour: 			0,
			minute: 		0,
			second: 		0,
			millisecond: 	0
		};
		
		// Merge dates
		VCO.Util.mergeData(_date, this.data);
		DATE_PARTS = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
		
		// Make strings into numbers
		for (var ix in DATE_PARTS) {	
			var parsed = parseInt(_date[DATE_PARTS[ix]]);
			if (isNaN(parsed)) parsed = 0;
			_date[DATE_PARTS[ix]] = parsed;
		}
		
		if (_date.month > 0 && _date.month <= 12) {
			_date.month = _date.month - 1;
		}

        if (this.data.scale == 'cosmological' 
            || _date.year < -271820 
            || _date.year >  275759) {
    		// Create Javascript date object
            this.data.scale = 'cosmological';
            this.data.date_obj = new VCO.BigYear(_date.year);
        } else {
            this.data.scale = 'javascript';
            this.data.date_obj = new Date(Date.UTC(_date.year, _date.month, _date.day, _date.hour, _date.minute, _date.second, _date.millisecond));
        }

	}
	
});

VCO.BigYear = VCO.Class.extend({
    initialize: function (year) {
        this.year = parseInt(year);
        if (isNaN(this.year)) { throw("Invalid year " + year) }
    },
    
    getDisplayText: function(vco_language) { 
        return this.year.toLocaleString(vco_language.lang);
    },

    getDisplayTextShort: function(vco_language) {
        return this.year.toLocaleString(vco_language.lang);
    },

    isBefore: function(that) {
        return this.year < that.year;
    },

    isAfter: function(that) {
        return this.year > that.year;
    },

    getTime: function() {
        return this.year;
    }

});

(function(cls){
    // cosmo units are years, not millis
    var AGE = 1000000;
    var EPOCH = AGE * 10;
    var ERA = EPOCH * 10;
    var EON = ERA * 5;

    var Floorer = function(unit) {
        return function(a_big_year) {
            var year = a_big_year.getTime();
            return new VCO.BigYear(Math.floor(year/unit) * unit);
        }
    }
    SCALES = [ // ( name, units_per_tick, flooring function, scale_class )
        ['millisecond',1, function(d) { },'javascript'],
        ['second',1000, function(d) { d.setMilliseconds(0);},'javascript'],
        ['minute',1000 * 60, function(d) { d.setSeconds(0);},'javascript'],
        ['hour',1000 * 60 * 60, function(d) { d.setMinutes(0);},'javascript'],
        ['day',1000 * 60 * 60 * 24, function(d) { d.setHours(0);},'javascript'],
        ['month',1000 * 60 * 60 * 24 * 30, function(d) { d.setDate(1);},'javascript'],
        ['year',1000 * 60 * 60 * 24 * 365, function(d) { d.setMonth(0);},'javascript'],
        ['decade',1000 * 60 * 60 * 24 * 365 * 10, function(d) { 
            var real_year = d.getFullYear();
            d.setFullYear( real_year - (real_year % 10)) 
        },'javascript'],
        ['century',1000 * 60 * 60 * 24 * 365 * 100, function(d) { 
            var real_year = d.getFullYear();
            d.setFullYear( real_year - (real_year % 100)) 
        },'javascript'],
        ['millennium',1000 * 60 * 60 * 24 * 365 * 1000, function(d) { 
            var real_year = d.getFullYear();
            d.setFullYear( real_year - (real_year % 1000)) 
        },'javascript'],
        // cosmological scales
        ['age',AGE, new Floorer(AGE),'cosmological'],    // 1M years
        ['epoch',EPOCH, new Floorer(EPOCH),'cosmological'], // 10M years
        ['era',ERA, new Floorer(ERA),'cosmological'],  // 100M years
        ['eon',EON, new Floorer(EON),'cosmological']  //500M years
    ]

    cls.SCALES = SCALES;

    var ISO8601_SHORT_PATTERN = /^([\+-]?\d+?)(-\d{2}?)?(-\d{2}?)?$/;
    // regex below from
    // http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
    var ISO8601_PATTERN = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

    /* For now, rather than extract parts from regexp, let's trust the browser.
     * Famous last words...
     * What about UTC vs local time?
     * see also http://stackoverflow.com/questions/10005374/ecmascript-5-date-parse-results-for-iso-8601-test-cases
     */
    cls.parseISODate = function(str) {
        var d = new Date(str);
        if (isNaN(d)) throw "Invalid date: " + str;
        return {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate(),
            hour: d.getHours(),
            minute: d.getMinutes(),
            second: d.getSeconds(),
            millisecond: d.getMilliseconds()
        }

    }

    cls.parseDate = function(str) {

        if (str.match(ISO8601_SHORT_PATTERN)) { 
            // parse short specifically to avoid timezone offset confusion
            // most browsers assume short is UTC, not local time.
            var parts = str.match(ISO8601_SHORT_PATTERN).slice(1);
            d = { year: parts[0].replace('+','')} // year can be negative
            if (parts[1]) { d['month'] = parts[1].replace('-',''); }
            if (parts[2]) { d['day'] = parts[2].replace('-',''); }
            return d;
        }

        if (str.match(ISO8601_PATTERN)) {
            return cls.parseISODate(str);
        }

        if (str.match(/^\-?\d+$/)) {
            return { year: str }
        }

        var parsed = {}
        if (str.match(/\d+\/\d+\/\d+/)) { // mm/yy/dddd
            var date = str.match(/\d+\/\d+\/\d+/)[0];
            str = VCO.Util.trim(str.replace(date,''));
            var date_parts = date.split('/');
            parsed.month = date_parts[0];
            parsed.day = date_parts[1];
            parsed.year = date_parts[2];
        }

        if (str.match(/\d+\/\d+/)) { // mm/yy
            var date = str.match(/\d+\/\d+/)[0];
            str = VCO.Util.trim(str.replace(date,''));
            var date_parts = date.split('/');
            parsed.month = date_parts[0];
            parsed.year = date_parts[1];
        }
        // todo: handle hours, minutes, seconds, millis other date formats, etc...
        if (str.match(':')) {
            var time_parts = str.split(':');
            parsed.hour = time_parts[0];
            parsed.minute = time_parts[1];
            if (time_parts[2]) {
                second_parts = time_parts[2].split('.');
                parsed.second = second_parts[0];
                parsed.millisecond = second_parts[1];
            }
        }
        return parsed;
    }

})(VCO.Date)