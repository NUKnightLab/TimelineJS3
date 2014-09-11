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
	
	best_dateformats: {
		base: {
			millisecond: 1,
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
			millisecond: 1,
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