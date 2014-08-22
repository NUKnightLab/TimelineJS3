VCO.Language = function(options) {
	this.messages = VCO.Language.languages.en;
	if (options && options.language && typeof(options.language) == 'string' && options.language != 'en') {
		var code = options.language;
		if (!(code in VCO.Language.languages)) {
			var url = options.script_path + "/locale/" + code + ".json"
			VCO.Language.languages[code] = VCO.ajax({ url: url, async: false });
		}
		VCO.Util.mergeData(this.messages,VCO.Language.languages[code]);
	}
}

VCO.Language.prototype.getMessage = function(k,idx) {
	try {
		var parts = k.split('.');
		var d = this.messages;
		for (var i = 0; i < parts.length; i++) {
			d = d[parts[i]];
		};
		if (d) {
			if (typeof(idx) != 'undefined') {
				return d[idx];
			}
			return d;
		}
	} catch(e) {
		trace(e);
	}
	if (idx) {
		return [k,idx].join(',');
	}
	return k
}

VCO.Language.prototype._ = VCO.Language.prototype.getMessage; // keep it concise

VCO.Language.prototype.formatDate = function(js_date, format_name) {
	// utc, timezone and timezoneClip are carry over from Steven Levithan implementation. We probably aren't going to use them.
	var utc = false, 
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g;


	if (!format_name) {
		format_name = 'full'; 
	}
	if (format_name.indexOf('dateformats.') == 0) {
		format_name = format_name.substr('dateformats.'.length);
	}

	var mask = this.messages['dateformats'][format_name];
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
			ddd:  this.messages.date.day_abbr[D],
			dddd: this.messages.date.day[D],
			m:    m + 1,
			mm:   VCO.Util.pad(m + 1),
			mmm:  this.messages.date.month_abbr[m],
			mmmm: this.messages.date.month[m],
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
		buttons: {
		    map_overview: 		"Map Overview",
			overview: 			"Overview",
		    backtostart: 		"Back To Beginning",
		    collapse_toggle: 	"Hide Map",
		    uncollapse_toggle: 	"Show Map"
		}
	}
}

VCO.Language.default = new VCO.Language();