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
	================================================== */
	findBestFormat: function(data, use_short) {
		var eval_array = ["millisecond", "second", "minute", "hour", "day", "month", "year"],
			format = "";
		
		for (var i = 0; i < eval_array.length; i++) {
			if (data[eval_array[i]]) {
				if (use_short) {
					return VCO.DateUtil.best_dateformat_lookup_short[eval_array[i]];
				} else {
					return VCO.DateUtil.best_dateformat_lookup[eval_array[i]];
				}
				
			}
		};
		return "";
	},
	
	best_dateformat_lookup: {
		millisecond: 1,
		second: VCO.Language.dateformats.time,
		minute: VCO.Language.dateformats.time_no_seconds_small_date,
		hour: VCO.Language.dateformats.time_no_seconds_small_date,
		day: VCO.Language.dateformats.full,
		month: VCO.Language.dateformats.month,
		year: VCO.Language.dateformats.year,
		decade: VCO.Language.dateformats.year,
		century: VCO.Language.dateformats.year,
		millennium: VCO.Language.dateformats.year,
		age: VCO.Language.dateformats.year,
		epoch: VCO.Language.dateformats.year,
		era: VCO.Language.dateformats.year,
		eon: VCO.Language.dateformats.year,
	},
	
	best_dateformat_lookup_short: {
		millisecond: 1,
		second: VCO.Language.dateformats.time_short,
		minute: VCO.Language.dateformats.time_no_seconds_short,
		hour: VCO.Language.dateformats.time_no_seconds_short,
		day: VCO.Language.dateformats.full_short,
		month: VCO.Language.dateformats.month_short,
		year: VCO.Language.dateformats.year,
		decade: VCO.Language.dateformats.year,
		century: VCO.Language.dateformats.year,
		millennium: VCO.Language.dateformats.year,
		age: VCO.Language.dateformats.year,
		epoch: VCO.Language.dateformats.year,
		era: VCO.Language.dateformats.year,
		eon: VCO.Language.dateformats.year,
	}
	
};