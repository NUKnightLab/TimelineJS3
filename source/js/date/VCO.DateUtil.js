/*	VCO.DateUtil
	Utilities for parsing time
================================================== */


VCO.DateUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	sortByDate: function(array) { // only for use with slide data objects
		array.sort(function(a,b){
			if (a.date.data.date_obj < b.date.data.date_obj) return -1;
			if (a.date.data.date_obj > b.date.data.date_obj) return 1;
			return 0;
		});
	},
	
	/*	Find Best Format
	================================================== */
	findBestFormat: function(data) {
		var eval_array = ["millisecond", "second", "minute", "hour", "day", "month", "year"],
			format = "";
		
		for (var i = 0; i < eval_array.length; i++) {
			if (data[eval_array[i]]) {
				return VCO.DateUtil.best_dateformat_lookup[eval_array[i]];
			}
		};
		return "";
	},
	
	best_dateformat_lookup: {
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