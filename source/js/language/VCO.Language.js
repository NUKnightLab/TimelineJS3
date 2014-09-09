VCO.Language = function(options) {
	for (k in VCO.Language.languages.en) {
		this[k] = VCO.Language.languages.en[k];
	}

	if (options && options.language && typeof(options.language) == 'string' && options.language != 'en') {
		var code = options.language;
		if (!(code in VCO.Language.languages)) {
			if (/\.json$/.test(code)) {
				var url = code;
			} else {
				var fragment = "/locale/" + code + ".json";
				var script_path = options.script_path || '';
				if (/\/$/.test(script_path)) { fragment = fragment.substr(1)}
				var url = script_path + fragment;
			}
			var self = this;
			var xhr = VCO.ajax({ 
				url: url, async: false
			});
			if (xhr.status == 200) {
				VCO.Language.languages[code] = JSON.parse(xhr.responseText);
			} else {
				throw "Could not load language [" + code + "]: " + xhr.statusText;
			}
		}
		VCO.Util.mergeData(this,VCO.Language.languages[code]);

	}
}

VCO.Language.formatNumber = function(val,mask) {
		if (mask.match(/%(\.(\d+))?f/)) {
			var match = mask.match(/%(\.(\d+))?f/);
			var token = match[0];
			if (match[2]) {
				val = val.toFixed(match[2]);
			}
			return mask.replace(token,val);
		}
		// use mask as literal display value.
		return mask;
	}



/* VCO.Util.mergeData is shallow, we have nested dicts. 
   This is a simplistic handling but should work.
 */
VCO.Language.prototype.mergeData = function(lang_json) {
	for (k in VCO.Language.languages.en) {
		if (lang_json[k]) {
			if (typeof(this[k]) == 'object') {
				VCO.Util.mergeData(lang_json[k], this[k]);
			} else {
				this[k] = lang_json[k]; // strings, mostly
			}
		}
	}
}

VCO.Language.fallback = { messages: {} }; // placeholder to satisfy IE8 early compilation
VCO.Language.prototype.getMessage = function(k) {
	return this.messages[k] || VCO.Language.fallback.messages[k] || k;
}

VCO.Language.prototype._ = VCO.Language.prototype.getMessage; // keep it concise

VCO.Language.prototype.formatDate = function(date, format_name) {

	if (date.constructor == Date) {
		return this.formatJSDate(date, format_name);
	}

	if (date.constructor == VCO.BigYear) {
		return this.formatBigYear(date, format_name);
	}

	if (date.data && date.data.date_obj) {
		return this.formatDate(date.data.date_obj, format_name);
	}

	trace("Unfamiliar date presented for formatting");
	return date.toString();
}

VCO.Language.prototype.formatBigYear = function(bigyear, format_name) {

	var the_year = bigyear.year;
	var format_list = this.bigdateformats[format_name];

	if (!format_list) {
		return VCO.Language.formatNumber(the_year,format_name);
	}

	if (format_list) {
		for (var i = 0; i < format_list.length; i++) {
			var tuple = format_list[i];
			if (Math.abs(the_year / tuple[0]) > 1) {
				// will we ever deal with distant future dates?
				return VCO.Language.formatNumber(Math.abs(the_year / tuple[0]),tuple[1])
			}
		};

		return the_year.toString();

	} else {
		trace("Language file dateformats missing cosmological. Falling back.");
	}
	trace("TODO: format bigyears")
	if (format_name == 'short') {
		return bigyear.getDisplayTextShort(this);
	}
	return bigyear.getDisplayText(this);
}

VCO.Language.prototype.formatJSDate = function(js_date, format_name) {
	// ultimately we probably want this to work with VCO.Date instead of (in addition to?) JS Date
	// utc, timezone and timezoneClip are carry over from Steven Levithan implementation. We probably aren't going to use them.
	var utc = false, 
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g;


	if (!format_name) {
		format_name = 'full'; 
	}

	var mask = this.dateformats[format_name] || VCO.Language.fallback.dateformats[format_name];
	if (!mask) {
		mask = format_name; // allow custom format strings
	}


	var	_ = utc ? "getUTC" : "get",
		d = js_date[_ + "Date"](),
		D = js_date[_ + "Day"](),
		m = js_date[_ + "Month"](),
		y = js_date[_ + "FullYear"](),
		H = js_date[_ + "Hours"](),
		M = js_date[_ + "Minutes"](),
		s = js_date[_ + "Seconds"](),
		L = js_date[_ + "Milliseconds"](),
		o = utc ? 0 : js_date.getTimezoneOffset(),
		year = "",
		flags = {
			d:    d,
			dd:   VCO.Util.pad(d),
			ddd:  this.date.day_abbr[D],
			dddd: this.date.day[D],
			m:    m + 1,
			mm:   VCO.Util.pad(m + 1),
			mmm:  this.date.month_abbr[m],
			mmmm: this.date.month[m],
			yy:   String(y).slice(2),
			yyyy: (this.use_bc && y < 0) ? year = Math.abs(y) + " " + this.use_bc : y,//y < 0 ? Math.abs(y) + " " + VCO.Language.date.before_common_era  : y,
			h:    H % 12 || 12,
			hh:   VCO.Util.pad(H % 12 || 12),
			H:    H,
			HH:   VCO.Util.pad(H),
			M:    M,
			MM:   VCO.Util.pad(M),
			s:    s,
			ss:   VCO.Util.pad(s),
			l:    VCO.Util.pad(L, 3),
			L:    VCO.Util.pad(L > 99 ? Math.round(L / 10) : L),
			t:    H < 12 ? "a"  : "p",
			tt:   H < 12 ? "am" : "pm",
			T:    H < 12 ? "A"  : "P",
			TT:   H < 12 ? "AM" : "PM",
			Z:    utc ? "UTC" : (String(js_date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			o:    (o > 0 ? "-" : "+") + VCO.Util.pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
		};

		return mask.replace(VCO.Language.DATE_FORMAT_TOKENS, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});

}

VCO.Language.DATE_FORMAT_TOKENS = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;

VCO.Language.languages = {
	en: {
		name: 					"English",
		lang: 					"en",
		messages: {
			loading: 			"Loading",
			wikipedia: 			"From Wikipedia, the free encyclopedia"
		},
		date: {
			month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			month_abbr: ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
			day: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			day_abbr: ["Sun.","Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."]
		}, 
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "mmm d",
			full: "mmmm d',' yyyy",
			time: "h:MM:ss TT' <small>'mmmm d',' yyyy'</small>'",
			time_short: "h:MM:ss TT",
			time_no_seconds_short: "h:MM TT",
			time_no_minutes_short: "h TT",
			time_no_seconds_small_date: "h:MM TT' <small>'mmmm d',' yyyy'</small>'",
			full_long: "mmm d',' yyyy 'at' h:MM TT",
			full_long_small_date: "h:MM TT' <small>mmm d',' yyyy'</small>'"
		},
		bigdateformats: {
			fallback: [ // a list of tuples, with t[0] an order of magnitude and t[1] a format string. format string syntax may change...
				[1000000000,"%.2f bya"],
				[1000000,"%.1f mya"],
				[1000,"%.1f kya"],
				[1, "%f years ago"]
			]
		}
	}
}

VCO.Language.fallback = new VCO.Language();