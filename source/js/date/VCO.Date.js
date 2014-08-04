/*	VCO.Date
	Date object
================================================== */
VCO.Date = VCO.Class.extend({
	
	initialize: function (data) {
		this.data = {
			year: 			"",
			month: 			"",
			day: 			"",
			hour: 			"",
			minute: 		"",
			second: 		"",
			millisecond: 	"",
			format: 		"YYYY MM DD",
			display_type: 	"April 30th, 1995",
			date_obj: 		{}
		};

		// Merge Data
		VCO.Util.mergeData(this.data, data);

		// Create Date Object
		this._createDateObj();
		
		// Creat Display Type
		if (this.data.date_obj.getMonth) {
			this._createDisplayType();
		}
		
	},
	
	/*	Private Methods
	================================================== */
	_setLanguage: function(lang) {
		VCO.Util.mergeData(this.dateformats, lang);
		/*
		this.dateformats					=	lang.dateformats;	
		this.date_dict.month				=	lang.date.month;
		this.date_dict.month_abbr			=	lang.date.month_abbr;
		this.date_dict.day					=	lang.date.day;
		this.date_dict.day_abbr				=	lang.date.day_abbr;
		this.dateformats.i18n.dayNames		=	lang.date.day_abbr.concat(lang.date.day);
		this.dateformats.i18n.monthNames	=	lang.date.month_abbr.concat(lang.date.month);
		*/
	},
	
	/*	Create Display Type
	================================================== */
	_setDateFormat: function() {
		// Set display Type
		this.data.format = "YYYY MM DD";
	},
	
	/*	Create Display Type
	================================================== */
	_createDisplayType: function() {
		// Set display Type
		//this.data.display_type = VCO.DateFormat.create(this.data.date_obj, this.data.format);
	},
	
	/*	Create JavaScript date object
	================================================== */
	_createDateObj: function() {
		var _date = {
			year: 			0,
			month: 			0,
			day: 			0,
			hour: 			0,
			minute: 		0,
			second: 		0,
			millisecond: 	0
		};
		
		// Merge dates
		VCO.Util.mergeData(_date, this.data);
		
		// Make strings into numbers
		for (var key in _date) {
			var parsed = parseInt(_date[key]);
			if (isNaN(parsed)) parsed = 0;
			_date[key] = parsed;
		}
		
		// Create Javascript date object
		this.data.date_obj = new Date(_date.year, _date.month, _date.day, _date.hour, _date.minute, _date.second, _date.millisecond);
		trace(this.data.date_obj);
	}
	
});


