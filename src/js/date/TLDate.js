/*	Date
	Date object
	MONTHS are 1-BASED, not 0-BASED (different from Javascript date objects)
================================================== */
import { TLClass } from "../core/TLClass"
import { Language } from "../language/Language"
import TLError from "../core/TLError"

import { mergeData, trim, trace } from "../core/Util"

//
// Class for human dates
//

export const SCALES = [
    // ( name, units_per_tick, flooring function )
    ["millisecond", 1, function(d) {}],
    [
        "second",
        1000,
        function(d) {
            d.setMilliseconds(0);
        }
    ],
    [
        "minute",
        1000 * 60,
        function(d) {
            d.setSeconds(0);
        }
    ],
    [
        "hour",
        1000 * 60 * 60,
        function(d) {
            d.setMinutes(0);
        }
    ],
    [
        "day",
        1000 * 60 * 60 * 24,
        function(d) {
            d.setHours(0);
        }
    ],
    [
        "month",
        1000 * 60 * 60 * 24 * 30,
        function(d) {
            d.setDate(1);
        }
    ],
    [
        "year",
        1000 * 60 * 60 * 24 * 365,
        function(d) {
            d.setMonth(0);
        }
    ],
    [
        "decade",
        1000 * 60 * 60 * 24 * 365 * 10,
        function(d) {
            var real_year = d.getFullYear();
            d.setFullYear(real_year - (real_year % 10));
        }
    ],
    [
        "century",
        1000 * 60 * 60 * 24 * 365 * 100,
        function(d) {
            var real_year = d.getFullYear();
            d.setFullYear(real_year - (real_year % 100));
        }
    ],
    [
        "millennium",
        1000 * 60 * 60 * 24 * 365 * 1000,
        function(d) {
            var real_year = d.getFullYear();
            d.setFullYear(real_year - (real_year % 1000));
        }
    ]
]

// Date parts from highest to lowest precision
const DATE_PARTS = [
    "millisecond",
    "second",
    "minute",
    "hour",
    "day",
    "month",
    "year"
];

const ISO8601_SHORT_PATTERN = /^([\+-]?\d+?)(-\d{2}?)?(-\d{2}?)?$/;

// regex below from
// http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
const ISO8601_PATTERN = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

/* For now, rather than extract parts from regexp, lets trust the browser.
 * Famous last words...
 * What about UTC vs local time?
 * see also http://stackoverflow.com/questions/10005374/ecmascript-5-date-parse-results-for-iso-8601-test-cases
 */
function parseISODate(str) {
    var d = new Date(str); // this is a true JavaScript date, not a TLDate
    if (isNaN(d)) {
        throw new TLError("invalid_date_err", str);
    }
    return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
        millisecond: d.getMilliseconds()
    };
};


const BEST_DATEFORMATS = {
    base: {
        millisecond: "time_short",
        second: "time",
        minute: "time_no_seconds_small_date",
        hour: "time_no_seconds_small_date",
        day: "full",
        month: "month",
        year: "year",
        decade: "year",
        century: "year",
        millennium: "year",
        age: "fallback",
        epoch: "fallback",
        era: "fallback",
        eon: "fallback",
        eon2: "fallback"
    },

    short: {
        millisecond: "time_short",
        second: "time_short",
        minute: "time_no_seconds_short",
        hour: "time_no_minutes_short",
        day: "full_short",
        month: "month_short",
        year: "year",
        decade: "year",
        century: "year",
        millennium: "year",
        age: "fallback",
        epoch: "fallback",
        era: "fallback",
        eon: "fallback",
        eon2: "fallback"
    }
};

export const TLDate = TLClass.extend({
    // @data = ms, JS Date object, or JS dictionary with date properties
    initialize: function(data, format, format_short) {
        if (typeof data == "number") {
            this.data = {
                format: "yyyy mmmm",
                date_obj: new Date(data)
            };
        } else if (Date == data.constructor) {
            this.data = {
                format: "yyyy mmmm",
                date_obj: data
            };
        } else {
            this.data = JSON.parse(JSON.stringify(data)); // clone don't use by reference.
            this._createDateObj();
        }

        this._setFormat(format, format_short);
    },

    setDateFormat: function(format) {
        this.data.format = format;
    },

    getDisplayDate: function(language, format) {
        if (this.data.display_date) {
            return this.data.display_date;
        }
        if (!language) {
            language = Language.fallback;
        }
        if (language.constructor != Language) {
            trace(
                "First argument to getDisplayDate must be type Language"
            );
            language = Language.fallback;
        }

        var format_key = format || this.data.format;
        return language.formatDate(this.data.date_obj, format_key);
    },

    getMillisecond: function() {
        return this.getTime();
    },

    getTime: function() {
        return this.data.date_obj.getTime();
    },

    isBefore: function(other_date) {
        if (!this.data.date_obj.constructor ==
            other_date.data.date_obj.constructor
        ) {
            throw new TLError("date_compare_err"); // but should be able to compare 'cosmological scale' dates once we get to that...
        }
        if ("isBefore" in this.data.date_obj) {
            return this.data.date_obj["isBefore"](
                other_date.data.date_obj
            );
        }
        return this.data.date_obj < other_date.data.date_obj;
    },

    isAfter: function(other_date) {
        if (!this.data.date_obj.constructor ==
            other_date.data.date_obj.constructor
        ) {
            throw new TLError("date_compare_err"); // but should be able to compare 'cosmological scale' dates once we get to that...
        }
        if ("isAfter" in this.data.date_obj) {
            return this.data.date_obj["isAfter"](
                other_date.data.date_obj
            );
        }
        return this.data.date_obj > other_date.data.date_obj;
    },

    // Return a new TLDate which has been 'floored' at the given scale.
    // @scale = string value from SCALES
    floor: function(scale) {
        var d = new Date(this.data.date_obj.getTime());
        for (var i = 0; i < SCALES.length; i++) {
            // for JS dates, we iteratively apply flooring functions
            SCALES[i][2](d);
            if (SCALES[i][0] == scale) return new TLDate(d);
        }

        throw new TLError("invalid_scale_err", scale);
    },

    /*	Private Methods
	================================================== */

    _getDateData: function() {
        var _date = {
            year: 0,
            month: 1, // stupid JS dates
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        };

        // Merge data
        mergeData(_date, this.data);

        // Make strings into numbers
        for (var ix in DATE_PARTS) {
            var x = trim(_date[DATE_PARTS[ix]]);
            if (!x.match(/^-?\d*$/)) {
                throw new TLError(
                    "invalid_date_err",
                    DATE_PARTS[ix] + " = '" + _date[DATE_PARTS[ix]] + "'"
                );
            }

            var parsed = parseInt(_date[DATE_PARTS[ix]]);
            if (isNaN(parsed)) {
                parsed = ix == 4 || ix == 5 ? 1 : 0; // month and day have diff baselines
            }
            _date[DATE_PARTS[ix]] = parsed;
        }

        if (_date.month > 0 && _date.month <= 12) {
            // adjust for JS's weirdness
            _date.month = _date.month - 1;
        }

        return _date;
    },

    _createDateObj: function() {
        var _date = this._getDateData();
        this.data.date_obj = new Date(
            _date.year,
            _date.month,
            _date.day,
            _date.hour,
            _date.minute,
            _date.second,
            _date.millisecond
        );
        if (this.data.date_obj.getFullYear() != _date.year) {
            // Javascript has stupid defaults for two-digit years
            this.data.date_obj.setFullYear(_date.year);
        }
    },

    /*  Find Best Format
     * this may not work with 'cosmologic' dates, or with TLDate if we
     * support constructing them based on JS Date and time
    ================================================== */
    findBestFormat: function(variant) {
        var eval_array = DATE_PARTS,
            format = "";

        for (var i = 0; i < eval_array.length; i++) {
            if (this.data[eval_array[i]]) {
                if (variant) {
                    if (!(variant in BEST_DATEFORMATS)) {
                        variant = "short"; // legacy
                    }
                } else {
                    variant = "base";
                }
                return BEST_DATEFORMATS[variant][eval_array[i]];
            }
        }
        return "";
    },
    _setFormat: function(format, format_short) {
        if (format) {
            this.data.format = format;
        } else if (!this.data.format) {
            this.data.format = this.findBestFormat();
        }

        if (format_short) {
            this.data.format_short = format_short;
        } else if (!this.data.format_short) {
            this.data.format_short = this.findBestFormat(true);
        }
    }
});

// offer something that can figure out the right date class to return
export function makeDate(data) {
    var date = new TLDate(data);
    if (!isNaN(date.getTime())) {
        return date;
    }
    return new BigDate(data);
}

export function parseDate(str) {
    if (str.match(ISO8601_SHORT_PATTERN)) {
        // parse short specifically to avoid timezone offset confusion
        // most browsers assume short is UTC, not local time.
        var parts = str.match(ISO8601_SHORT_PATTERN).slice(1);
        var d = { year: parts[0].replace("+", "") }; // year can be negative
        if (parts[1]) {
            d["month"] = parts[1].replace("-", "");
        }
        if (parts[2]) {
            d["day"] = parts[2].replace("-", "");
        }
        return d;
    }

    if (str.match(ISO8601_PATTERN)) {
        return cls.parseISODate(str);
    }

    if (str.match(/^\-?\d+$/)) {
        return { year: str };
    }

    var parsed = {};
    if (str.match(/\d+\/\d+\/\d+/)) {
        // mm/yy/dddd
        var date = str.match(/\d+\/\d+\/\d+/)[0];
        str = trim(str.replace(date, ""));
        var date_parts = date.split("/");
        parsed.month = date_parts[0];
        parsed.day = date_parts[1];
        parsed.year = date_parts[2];
    }

    if (str.match(/\d+\/\d+/)) {
        // mm/yy
        var date = str.match(/\d+\/\d+/)[0];
        str = trim(str.replace(date, ""));
        var date_parts = date.split("/");
        parsed.month = date_parts[0];
        parsed.year = date_parts[1];
    }

    if (str.match(":")) {
        var time_parts = str.split(":");
        parsed.hour = time_parts[0];
        parsed.minute = time_parts[1];
        if (time_parts[2]) {
            let second_parts = time_parts[2].split(".");
            parsed.second = second_parts[0];
            parsed.millisecond = second_parts[1];
        }
    }
    return parsed;
};

export const BigYear = TLClass.extend({
    initialize: function(year) {
        this.year = parseInt(year);
        if (isNaN(this.year)) {
            throw new TLError("invalid_year_err", year);
        }
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


//
// Class for cosmological dates
//

// cosmo units are years, not millis
const AGE = 1000000;
const EPOCH = AGE * 10;
const ERA = EPOCH * 10;
const EON = ERA * 10;

function Floorer(unit) {
    return function(a_big_year) {
        var year = a_big_year.getTime();
        return new BigYear(Math.floor(year / unit) * unit);
    }
}

// cosmological scales
export const BIG_DATE_SCALES = [ // ( name, units_per_tick, flooring function )
    ['year', 1, new Floorer(1)],
    ['decade', 10, new Floorer(10)],
    ['century', 100, new Floorer(100)],
    ['millennium', 1000, new Floorer(1000)],
    ['age', AGE, new Floorer(AGE)], // 1M years
    ['epoch', EPOCH, new Floorer(EPOCH)], // 10M years
    ['era', ERA, new Floorer(ERA)], // 100M years
    ['eon', EON, new Floorer(EON)] // 1B years
];


export const BigDate = TLDate.extend({
    // @data = BigYear object or JS dictionary with date properties
    initialize: function(data, format, format_short) {
        if (BigYear == data.constructor) {
            this.data = {
                date_obj: data
            };
        } else {
            this.data = JSON.parse(JSON.stringify(data));
            this._createDateObj();
        }

        this._setFormat(format, format_short);
    },

    // Create date_obj
    _createDateObj: function() {
        var _date = this._getDateData();
        this.data.date_obj = new BigYear(_date.year);
    },

    // Return a new BigDate which has been 'floored' at the given scale.
    // @scale = string value from BIG_DATE_SCALES
    floor: function(scale) {
        for (var i = 0; i < BIG_DATE_SCALES.length; i++) {
            if (BIG_DATE_SCALES[i][0] == scale) {
                var floored = BIG_DATE_SCALES[i][2](this.data.date_obj);
                return new BigDate(floored);
            }
        }

        throw new TLError("invalid_scale_err", scale);
    }
});