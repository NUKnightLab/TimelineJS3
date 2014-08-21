VCO.Language = function(options) {
	this.messages = VCO.Language.languages.en;
	if (options && options.language && typeof(options.language) == 'string') {
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