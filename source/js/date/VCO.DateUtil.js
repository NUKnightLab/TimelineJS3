/*	VCO.DateUtil
	Utilities for parsing time
================================================== */


VCO.DateUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	getDateFractions: function(the_date, is_utc) {
		
		var _time = {};
		_time.days			= the_date		/	dateFractionBrowser.day;
		_time.weeks 		= _time.days	/	dateFractionBrowser.week;
		_time.months 		= _time.days	/	dateFractionBrowser.month;
		_time.years 		= _time.months 	/	dateFractionBrowser.year;
		_time.hours 		= _time.days	*	dateFractionBrowser.hour;
		_time.minutes 		= _time.days	*	dateFractionBrowser.minute;
		_time.seconds 		= _time.days	*	dateFractionBrowser.second;
		_time.decades 		= _time.years	/	dateFractionBrowser.decade;
		_time.centuries 	= _time.years	/	dateFractionBrowser.century;
		_time.milleniums 	= _time.years	/	dateFractionBrowser.millenium;
		_time.ages			= _time.years	/	dateFractionBrowser.age;
		_time.epochs		= _time.years	/	dateFractionBrowser.epoch;
		_time.eras			= _time.years	/	dateFractionBrowser.era;
		_time.eons			= _time.years	/	dateFractionBrowser.eon;
		
		/*
		trace("AGES "		 + 		_time.ages);
		trace("EPOCHS "		 + 		_time.epochs);
		trace("MILLENIUMS "  + 		_time.milleniums);
		trace("CENTURIES "	 + 		_time.centuries);
		trace("DECADES "	 + 		_time.decades);
		trace("YEARS "		 + 		_time.years);
		trace("MONTHS "		 + 		_time.months);
		trace("WEEKS "		 + 		_time.weeks);
		trace("DAYS "		 + 		_time.days);
		trace("HOURS "		 + 		_time.hours);
		trace("MINUTES "	 + 		_time.minutes);
		trace("SECONDS "	 + 		_time.seconds);
		*/
		return _time;
	},
	
	calculateInterval: function(time) {
		var interval_calc = {},
			_first								= VCO.DateUtil.getDateFractions(time[0].startdate),
			_last								= VCO.DateUtil.getDateFractions(time[data.length - 1].enddate);
		
		// EON
		interval_calc.eon.type					=	"eon";
		interval_calc.eon.first					=	_first.eons;
		interval_calc.eon.base					=	Math.floor(_first.eons);
		interval_calc.eon.last					=	_last.eons;
		interval_calc.eon.number				=	timespan.eons;
		interval_calc.eon.multiplier		 	=	timelookup.eons;
		interval_calc.eon.minor					=	timelookup.eons;
		
		// ERA
		interval_calc.era.type					=	"era";
		interval_calc.era.first					=	_first.eras;
		interval_calc.era.base					=	Math.floor(_first.eras);
		interval_calc.era.last					=	_last.eras;
		interval_calc.era.number				=	timespan.eras;
		interval_calc.era.multiplier		 	=	timelookup.eras;
		interval_calc.era.minor					=	timelookup.eras;
		
		// EPOCH
		interval_calc.epoch.type				=	"epoch";
		interval_calc.epoch.first				=	_first.epochs;
		interval_calc.epoch.base				=	Math.floor(_first.epochs);
		interval_calc.epoch.last				=	_last.epochs;
		interval_calc.epoch.number				=	timespan.epochs;
		interval_calc.epoch.multiplier		 	=	timelookup.epochs;
		interval_calc.epoch.minor				=	timelookup.epochs;
		
		// AGE
		interval_calc.age.type					=	"age";
		interval_calc.age.first					=	_first.ages;
		interval_calc.age.base					=	Math.floor(_first.ages);
		interval_calc.age.last					=	_last.ages;
		interval_calc.age.number				=	timespan.ages;
		interval_calc.age.multiplier		 	=	timelookup.ages;
		interval_calc.age.minor					=	timelookup.ages;
		
		// MILLENIUM
		interval_calc.millenium.type 			=	"millenium";
		interval_calc.millenium.first			=	_first.milleniums;
		interval_calc.millenium.base			=	Math.floor(_first.milleniums);
		interval_calc.millenium.last			=	_last.milleniums;
		interval_calc.millenium.number			=	timespan.milleniums;
		interval_calc.millenium.multiplier	 	=	timelookup.millenium;
		interval_calc.millenium.minor			=	timelookup.millenium;
		
		// CENTURY
		interval_calc.century.type 				= "century";
		interval_calc.century.first 			= _first.centuries;
		interval_calc.century.base 				= Math.floor(_first.centuries);
		interval_calc.century.last 				= _last.centuries;
		interval_calc.century.number 			= timespan.centuries;
		interval_calc.century.multiplier	 	= timelookup.century;
		interval_calc.century.minor 			= timelookup.century;
		
		// DECADE
		interval_calc.decade.type 				= "decade";
		interval_calc.decade.first 				= _first.decades;
		interval_calc.decade.base 				= Math.floor(_first.decades);
		interval_calc.decade.last 				= _last.decades;
		interval_calc.decade.number 			= timespan.decades;
		interval_calc.decade.multiplier 		= timelookup.decade;
		interval_calc.decade.minor 				= timelookup.decade;
		
		// YEAR
		interval_calc.year.type					= "year";
		interval_calc.year.first 				= _first.years;
		interval_calc.year.base 				= Math.floor(_first.years);
		interval_calc.year.last					= _last.years;
		interval_calc.year.number 				= timespan.years;
		interval_calc.year.multiplier 			= 1;
		interval_calc.year.minor 				= timelookup.month;
		
		// MONTH
		interval_calc.month.type 				= "month";
		interval_calc.month.first 				= _first.months;
		interval_calc.month.base 				= Math.floor(_first.months);
		interval_calc.month.last 				= _last.months;
		interval_calc.month.number 				= timespan.months;
		interval_calc.month.multiplier 			= 1;
		interval_calc.month.minor 				= Math.round(timelookup.week);
		
		// WEEK
		// NOT DONE
		interval_calc.week.type 				= "week";
		interval_calc.week.first 				= _first.weeks;
		interval_calc.week.base 				= Math.floor(_first.weeks);
		interval_calc.week.last 				= _last.weeks;
		interval_calc.week.number 				= timespan.weeks;
		interval_calc.week.multiplier 			= 1;
		interval_calc.week.minor 				= 7;
		
		// DAY
		interval_calc.day.type 					= "day";
		interval_calc.day.first 				= _first.days;
		interval_calc.day.base	 				= Math.floor(_first.days);
		interval_calc.day.last 					= _last.days;
		interval_calc.day.number 				= timespan.days;
		interval_calc.day.multiplier 			= 1;
		interval_calc.day.minor 				= 24;
		
		// HOUR
		interval_calc.hour.type 				= "hour";
		interval_calc.hour.first 				= _first.hours;
		interval_calc.hour.base 				= Math.floor(_first.hours);
		interval_calc.hour.last 				= _last.hours;
		interval_calc.hour.number 				= timespan.hours;
		interval_calc.hour.multiplier 			= 1;
		interval_calc.hour.minor 				= 60;
		
		// MINUTE
		interval_calc.minute.type 				= "minute";
		interval_calc.minute.first 				= _first.minutes;
		interval_calc.minute.base 				= Math.floor(_first.minutes);
		interval_calc.minute.last 				= _last.minutes;
		interval_calc.minute.number 			= timespan.minutes;
		interval_calc.minute.multiplier 		= 1;
		interval_calc.minute.minor 				= 60;
		
		// SECOND
		interval_calc.second.type 				= "decade";
		interval_calc.second.first 				= _first.seconds;
		interval_calc.second.base 				= Math.floor(_first.seconds);
		interval_calc.second.last 				= _last.seconds;
		interval_calc.second.number 			= timespan.seconds;
		interval_calc.second.multiplier 		= 1;
		interval_calc.second.minor 				= 10;
		
		return interval_calc;
	},

	sortByDate: function(array) { // only for use with slide data objects
		array.sort(function(a,b){
			if (a.date.data.date_obj < b.date.data.date_obj) return -1;
			if (a.date.data.date_obj > b.date.data.date_obj) return 1;
			return 0;
		});
	}
	
};