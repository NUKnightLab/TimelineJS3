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
	}
	
};