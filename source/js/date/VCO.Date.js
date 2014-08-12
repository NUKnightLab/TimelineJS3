/*	VCO.Date
	Date object
	MONTHS are 1-BASED, not 0-BASED (different from Javascript date objects)
================================================== */
VCO.Date = VCO.Class.extend({
	
	initialize: function (data, format, format_short) {
		if (typeof(data) == 'number' || Date == data.constructor) {
			var date = null;
			if (Date == data.constructor) {
				date = data;
			} else {
				date = new Date(data);
			}
			this.data = {
				format: 		"yyyy mmmm",
				display_type: 	"",
				date_obj: 		date
			}
			
		} else {
			this.data = {
				year: 			"",
				month: 			"",
				day: 			"",
				hour: 			"",
				minute: 		"",
				second: 		"",
				millisecond: 	"",
				format: 		"yyyy mmmm",
				format_short: 	"yyyy mmmm",
				display_text: 	"",
				display_text_short: "",
				date_obj: 		{}
			};
			
			
			// Merge Data
			VCO.Util.mergeData(this.data, data);

			// Create Date Object
			this._createDateObj();
		}
		
		if (format) {
			this.data.format = format;
		} else {
			this.data.format = VCO.DateUtil.findBestFormat(this.data);
		}
		
		if (format_short) {
			this.data.format_short = format_short;
		} else {
			this.data.format_short = VCO.DateUtil.findBestFormat(this.data, true);
		}
		
		this._createDisplayType();
		
		
	},
	
	/*	Private Methods
	================================================== */
	
	/*	Create Display Type
	================================================== */
	setDateFormat: function(format) {
		// Set display type format
		this.data.format = format;
		this._createDisplayType();
	},
	
	getDisplayDate: function(use_short) {
		if (use_short) {
			return this.data.display_text_short;
		} else {
			return this.data.display_text;
		}
		
	},
	
	getMillisecond: function() {
		return this.getTime();
	},
	
	getTime: function() {
		return this.data.date_obj.getTime();
	},
	
	/*	Create Display Type
	================================================== */
	_createDisplayType: function() {
		this.data.display_text = VCO.DateFormat(this.data.date_obj, this.data.format);
		this.data.display_text_short = VCO.DateFormat(this.data.date_obj, this.data.format);
	},
	
	isBefore: function(other_date) { 
		if (!(VCO.Date == other_date.constructor)) { throw("Can only compare to VCO.Date")}
		if (this.data.date_obj) {
			if (!(Date == other_date.data.date_obj.constructor)) {
				throw("Can't compare VCO.Dates on different scales") // but should be able to compare 'cosmological scale' dates once we get to that...
			}
			return this.data.date_obj < other_date.data.date_obj
		}
		throw("Can't compare");
	},

	isAfter: function(other_date) {
		if (!(VCO.Date == other_date.constructor)) { throw("Can only compare to VCO.Date")}
		if (this.data.date_obj) {
			if (!(Date == other_date.data.date_obj.constructor)) {
				throw("Can't compare VCO.Dates on different scales") // but should be able to compare 'cosmological scale' dates once we get to that...
			}
			return this.data.date_obj > other_date.data.date_obj
		}
		throw("Can't compare");

	},

	/*	Create JavaScript date object
	================================================== */
	_createDateObj: function() {
		var _date = {
			year: 			0,
			month: 			1, // stupid JS dates
			day: 			0,
			hour: 			0,
			minute: 		0,
			second: 		0,
			millisecond: 	0
		};
		
		// Merge dates
		VCO.Util.mergeData(_date, this.data);
		DATE_PARTS = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
		
		// Make strings into numbers
		for (var ix in DATE_PARTS) {	
			var parsed = parseInt(_date[DATE_PARTS[ix]]);
			if (isNaN(parsed)) parsed = 0;
			_date[DATE_PARTS[ix]] = parsed;
		}
		
		if (_date.month > 0 && _date.month <= 12) {
			_date.month = _date.month - 1;
		}
		// Create Javascript date object
		this.data.date_obj = new Date(_date.year, _date.month, _date.day, _date.hour, _date.minute, _date.second, _date.millisecond);
	}
	
});


