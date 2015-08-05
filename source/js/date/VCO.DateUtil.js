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

		if (period && period.toLowerCase()[0] == 'p' && parsed.hour != 12) {
			parsed.hour += 12;
		} else if (period && period.toLowerCase()[0] == 'a' && parsed.hour == 12) {
			parsed.hour = 0;
		}


		if (isNaN(parsed.hour) || parsed.hour < 0 || parsed.hour > 23) {
			throw new Error("Invalid time (hour) " + parsed.hour);
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
	}
	
};