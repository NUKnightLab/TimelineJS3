/*	VCO.Date
	Date object
	MONTHS are 1-BASED, not 0-BASED (different from Javascript date objects)
================================================== */
VCO.Date = VCO.Class.extend({
	
	initialize: function (data, format) {
		if (typeof(data) == 'number') {
			this.data = {
				format: 		"yyyy mmmm",
				display_type: 	"1995",
				date_obj: 		new Date(data)
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
				display_type: 	"1995",
				date_obj: 		{}
			};
			
			
			// Merge Data
			VCO.Util.mergeData(this.data, data);

			// Create Date Object
			this._createDateObj();
			

		}
		
		if (format) {
			this.data.format;
		}
		// Set Format and set desiplay Type
		this._createDisplayType();
		
		
	},
	
	/*	Private Methods
	================================================== */
	
	/*	Create Display Type
	================================================== */
	_setDateFormat: function(format) {
		// Set display type format
		this.data.format = format;
		this._createDisplayType();
	},
	
	getDisplayDate: function() {
		return this.data.display_type;
	},
	
	getMillisecond: function() {
		return this.data.date_obj.getTime();
	},
	
	/*	Create Display Type
	================================================== */
	_createDisplayType: function() {
		// Set display Type
		trace(VCO.DateFormat(this.data.date_obj, this.data.format));
		
		//VCO.Language.dateformats
		//this.data.display_type = VCO.DateFormat(this.data.date_obj, this.data.format);
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


