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
		var eval_array = ["millisecond", "second", "minute", "hour", "day", "month", "year"],
			format = "";
		
		for (var i = 0; i < eval_array.length; i++) {
			if ( data[eval_array[i]]) {
				if (variant) {
					if (!(variant in VCO.DateUtil.best_dateformats)) {
						variant = 'short'; // legacy
					}
				} else {
					variant = 'default'
				}
				return VCO.DateUtil.best_dateformats[variant][eval_array[i]];		
			}
		};
		return "";
	},
	
	best_dateformats: {
		default: {
			millisecond: 1,
			second: 'dateformats.time',
			minute: 'dateformats.time_no_seconds_small_date',
			hour: 'dateformats.time_no_seconds_small_date',
			day: 'dateformats.full',
			month: 'dateformats.month',
			year: 'dateformats.year',
			decade: 'dateformats.year',
			century: 'dateformats.year',
			millennium: 'dateformats.year',
			age: 'dateformats.year',
			epoch: 'dateformats.year',
			era: 'dateformats.year',
			eon: 'dateformats.year',
		},
		
		short: {
			millisecond: 1,
			second: 'dateformats.time_short',
			minute: 'dateformats.time_no_seconds_short',
			hour: 'dateformats.time_no_minutes_short',
			day: 'dateformats.full_short',
			month: 'dateformats.month_short',
			year: 'dateformats.year',
			decade: 'dateformats.year',
			century: 'dateformats.year',
			millennium: 'dateformats.year',
			age: 'dateformats.year',
			epoch: 'dateformats.year',
			era: 'dateformats.year',
			eon: 'dateformats.year',
		}
	}
	
};