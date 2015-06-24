/*	VCO.DateUtil
	Utilities for parsing time
================================================== */


VCO.DateUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	sortByDate: function(array,prop_name) { // only for use with slide data objects
		var prop_name = prop_name || 'start_date';
		array.sort(function(a,b){
			if (a[prop_name].isBefore(b[prop_name])) return -1;
			if (a[prop_name].isAfter(b[prop_name])) return 1;
			return 0;
		});
	},
	
	/*	Find Best Format
	 * this may not work with 'cosmologic' dates, or with VCO.Date if we 
	 * support constructing them based on JS Date and time
	================================================== */
	findBestFormat: function(data, variant) {
		var eval_array = VCO.Date.DATE_PARTS,
			format = "";
		
		for (var i = 0; i < eval_array.length; i++) {
			if ( data[eval_array[i]]) {
				if (variant) {
					if (!(variant in VCO.DateUtil.best_dateformats)) {
						variant = 'short'; // legacy
					}
				} else {
					variant = 'base'
				}
				return VCO.DateUtil.best_dateformats[variant][eval_array[i]];		
			}
		};
		return "";
	},
	
	parseTime: function(time_str) {
		var parsed = {
			hour: null, minute: null, second: null, millisecond: null // conform to keys in VCO.Date
		}
		var period = null;
		var match = time_str.match(/(\s*[AaPp]\.?[Mm]\.?\s*)$/);
		if (match) {
			period = VCO.Util.trim(match[0]);
			time_str = VCO.Util.trim(time_str.substring(0,time_str.lastIndexOf(period)));
		}

		var parts = [];
		var no_separators = time_str.match(/^\s*(\d{1,2})(\d{2})\s*$/);
		if (no_separators) {
			parts = no_separators.slice(1);
		} else {
			parts = time_str.split(':');
			if (parts.length == 1) {
				parts = time_str.split('.');
			}
		}

		if (parts.length > 4) { throw new Error("Invalid time: misuse of : or . as separator.");}

		parsed.hour = parseInt(parts[0]);

		if (period && period.toLowerCase()[0] == 'p') {
			parsed.hour += 12;
		}


		if (isNaN(parsed.hour) || parsed.hour < 0 || parsed.hour > 23) {
			throw new Error("Invalid time (hour)");
		}

		if (parts.length > 1) {
			parsed.minute = parseInt(parts[1]);
			if (isNaN(parsed.minute)) { throw new Error("Invalid time (minute)"); }
		}

		if (parts.length > 2) {
			var sec_parts = parts[2].split(/[\.,]/);
			parts = sec_parts.concat(parts.slice(3)) // deal with various methods of specifying fractional seconds
			if (parts.length > 2) { throw new Error("Invalid time (seconds and fractional seconds)")}
			parsed.second = parseInt(parts[0]);
			if (isNaN(parsed.second)) { throw new Error("Invalid time (second)")}
			if (parts.length == 2) {
				var frac_secs = parseInt(parts[1]);
				if (isNaN(frac_secs)) { throw new Error("Invalid time (fractional seconds)")}
				parsed.millisecond = 100 * frac_secs;
			}
		}

		return parsed;
	},
	best_dateformats: {
		base: {
			millisecond: 'time_short',
			second: 'time',
			minute: 'time_no_seconds_small_date',
			hour: 'time_no_seconds_small_date',
			day: 'full',
			month: 'month',
			year: 'year',
			decade: 'year',
			century: 'year',
			millennium: 'year',
			age: 'fallback',
			epoch: 'fallback',
			era: 'fallback',
			eon: 'fallback',
			eon2: 'fallback'
		},
		
		short: {
			millisecond: 'time_short',
			second: 'time_short',
			minute: 'time_no_seconds_short',
			hour: 'time_no_minutes_short',
			day: 'full_short',
			month: 'month_short',
			year: 'year',
			decade: 'year',
			century: 'year',
			millennium: 'year',
			age: 'fallback',
			epoch: 'fallback',
			era: 'fallback',
			eon: 'fallback',
			eon2: 'fallback'
		}
	}
	
};