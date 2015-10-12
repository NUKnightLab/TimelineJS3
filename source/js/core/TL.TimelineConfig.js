/*  TL.TimelineConfig
separate the configuration from the display (TL.Timeline)
to make testing easier
================================================== */
TL.TimelineConfig = TL.Class.extend({

	includes: [],
	initialize: function (data) {
		this.title = '';
		this.scale = '';
		this.events = [];
		this.eras = [];
		this.event_dict = {}; // despite name, all slides (events + title) indexed by slide.unique_id
		this.messages = {
			errors: [],
			warnings: []
		};

		// Initialize the data
		if (typeof data === 'object' && data.events) {
			this.scale = data.scale;
			this.events = [];
			this._ensureValidScale(data.events);

			if (data.title) {
				var title_id = this._assignID(data.title);
				this._tidyFields(data.title);
				this.title = data.title;
				this.event_dict[title_id] = this.title;
			}

			for (var i = 0; i < data.events.length; i++) {
				try {
					this.addEvent(data.events[i], true);
				} catch (e) {
				    this.logError(e);
				}
			}

			if (data.eras) {
				for (var i = 0; i < data.eras.length; i++) {
					try {
						this.addEra(data.eras[i], true);
					} catch (e) {
						this.logError("Era " + i + ": " + e);
					}
				}
			}

			TL.DateUtil.sortByDate(this.events);
			TL.DateUtil.sortByDate(this.eras);

		}
	},
	logError: function(msg) {
		trace(msg);
		this.messages.errors.push(msg);
	},
	/*
	 * Return any accumulated error messages. If `sep` is passed, it should be a string which will be used to join all messages, resulting in a string return value. Otherwise,
	 * errors will be returned as an array.
	 */
	getErrors: function(sep) {
		if (sep) {
			return this.messages.errors.join(sep);
		} else {
			return this.messages.errors;
		}
	},
	/*
	 * Perform any sanity checks we can before trying to use this to make a timeline. Returns nothing, but errors will be logged
	 * such that after this is called, one can test `this.isValid()` to see if everything is OK.
	 */
	validate: function() {
		if (typeof(this.events) == "undefined" || typeof(this.events.length) == "undefined" || this.events.length == 0) {
			this.logError("Timeline configuration has no events.")
		}
	},
	isValid: function() {
		return this.messages.errors.length == 0;
	},
	/* Add an event (including cleaning/validation) and return the unique id.
	* All event data validation should happen in here.
	* Throws: TL.Error for any validation problems.
	*/
	addEvent: function(data, defer_sort) {
		var event_id = this._assignID(data);

		if (typeof(data.start_date) == 'undefined') {
		    throw new TL.Error("missing_start_date_err", event_id);
		} else {
			this._processDates(data);
			this._tidyFields(data);
		}

		this.events.push(data);
		this.event_dict[event_id] = data;

		if (!defer_sort) {
			TL.DateUtil.sortByDate(this.events);
		}
		return event_id;
	},

	addEra: function(data, defer_sort) {
		var event_id = this._assignID(data);

		if (typeof(data.start_date) == 'undefined') {
		    throw new TL.Error("missing_start_date_err", event_id);
		} else {
			this._processDates(data);
			this._tidyFields(data);
		}

		this.eras.push(data);
		this.event_dict[event_id] = data;

		if (!defer_sort) {
			TL.DateUtil.sortByDate(this.eras);
		}
		return event_id;
	},

	/**
	 * Given a slide, verify that its ID is unique, or assign it one which is.
	 * The assignment happens in this function, and the assigned ID is also
	 * the return value. Not thread-safe, because ids are not reserved
	 * when assigned here.
	 */
	_assignID: function(slide) {
		var slide_id = slide.unique_id;
		if (!TL.Util.trim(slide_id)) {
			// give it an ID if it doesn't have one
			slide_id = (slide.text) ? TL.Util.slugify(slide.text.headline) : null;
		}
		// make sure it's unique and add it.
		slide.unique_id = TL.Util.ensureUniqueKey(this.event_dict,slide_id);
		return slide.unique_id
	},

	/**
	 * Given an array of slide configs (the events), ensure that each one has a distinct unique_id. The id of the title
	 * is also passed in because in most ways it functions as an event slide, and the event IDs must also all be unique
	 * from the title ID.
	 */
	_makeUniqueIdentifiers: function(title_id, array) {
		var used = [title_id];

		// establish which IDs are assigned and if any appear twice, clear out successors.
		for (var i = 0; i < array.length; i++) {
			if (TL.Util.trim(array[i].unique_id)) {
				array[i].unique_id = TL.Util.slugify(array[i].unique_id); // enforce valid
				if (used.indexOf(array[i].unique_id) == -1) {
					used.push(array[i].unique_id);
				} else { // it was already used, wipe it out
					array[i].unique_id = '';
				}
			}
		};

		if (used.length != (array.length + 1)) {
			// at least some are yet to be assigned
			for (var i = 0; i < array.length; i++) {
				if (!array[i].unique_id) {
					// use the headline for the unique ID if it's available
					var slug = (array[i].text) ? TL.Util.slugify(array[i].text.headline) : null;
					if (!slug) {
						slug = TL.Util.unique_ID(6); // or generate a random ID
					}
					if (used.indexOf(slug) != -1) {
						slug = slug + '-' + i; // use the index to get a unique ID.
					}
					used.push(slug);
					array[i].unique_id = slug;
				}
			}
		}
	},
	_ensureValidScale: function(events) {
		if(!this.scale) {
			trace("Determining scale dynamically");
			this.scale = "human"; // default to human unless there's a slide which is explicitly 'cosmological' or one which has a cosmological year

			for (var i = 0; i < events.length; i++) {
				if (events[i].scale == 'cosmological') {
					this.scale = 'cosmological';
					break;
				}
				if (events[i].start_date && typeof(events[i].start_date.year) != "undefined") {
					var d = new TL.BigDate(events[i].start_date);
					var year = d.data.date_obj.year;
					if(year < -271820 || year >  275759) {
						this.scale = "cosmological";
						break;
					}
				}
			}
		}
		var dateCls = TL.DateUtil.SCALE_DATE_CLASSES[this.scale];
		if (!dateCls) { this.logError("Don't know how to process dates on scale "+this.scale); }
	},
	/*
	   Given a thing which has a start_date and optionally an end_date, make sure that it is an instance
		 of the correct date class (for human or cosmological scale). For slides, remove redundant end dates
		 (people frequently configure an end date which is the same as the start date).
	 */
	_processDates: function(slide_or_era) {
		var dateCls = TL.DateUtil.SCALE_DATE_CLASSES[this.scale];
		if(!(slide_or_era.start_date instanceof dateCls)) {
			var start_date = slide_or_era.start_date;
			slide_or_era.start_date = new dateCls(start_date);

			// eliminate redundant end dates.
			if (typeof(slide_or_era.end_date) != 'undefined' && !(slide_or_era.end_date instanceof dateCls)) {
				var end_date = slide_or_era.end_date;
				var equal = true;
				for (property in start_date) {
					equal = equal && (start_date[property] == end_date[property]);
				}
				if (equal) {
					trace("End date same as start date is redundant; dropping end date");
					delete slide_or_era.end_date;
				} else {
					slide_or_era.end_date = new dateCls(end_date);
				}

			}
		}

	},
	/**
	 * Return the earliest date that this config knows about, whether it's a slide or an era
	 */
	getEarliestDate: function() {
		// counting that dates were sorted in initialization
		var date = this.events[0].start_date;
		if (this.eras && this.eras.length > 0) {
			if (this.eras[0].start_date.isBefore(date)) {
				return this.eras[0].start_date;
			}
		}
		return date;

	},
	/**
	 * Return the latest date that this config knows about, whether it's a slide or an era, taking end_dates into account.
	 */
	getLatestDate: function() {
		var dates = [];
		for (var i = 0; i < this.events.length; i++) {
			if (this.events[i].end_date) {
				dates.push({ date: this.events[i].end_date });
			} else {
				dates.push({ date: this.events[i].start_date });
			}
		}
		for (var i = 0; i < this.eras.length; i++) {
			if (this.eras[i].end_date) {
				dates.push({ date: this.eras[i].end_date });
			} else {
				dates.push({ date: this.eras[i].start_date });
			}
		}
		TL.DateUtil.sortByDate(dates, 'date');
		return dates.slice(-1)[0].date;
	},
	_tidyFields: function(slide) {

		function fillIn(obj,key,default_value) {
			if (!default_value) default_value = '';
			if (!obj.hasOwnProperty(key)) { obj[key] = default_value }
		}

		if (slide.group) {
			slide.group = TL.Util.trim(slide.group);
		}

		if (!slide.text) {
			slide.text = {};
		}
		fillIn(slide.text,'text');
		fillIn(slide.text,'headline');
	}
});
