/*  VCO.TimelineConfig
separate the configuration from the display (VCO.Timeline)
to make testing easier
================================================== */
VCO.TimelineConfig = VCO.Class.extend({

	includes: [],
	initialize: function (data) {
		this.title = '';
		this.scale = '';
		this.events = [];
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
					this.logError("Event " + i + ": " + e);
				}
			}
			VCO.DateUtil.sortByDate(this.events);


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
	* Throws: string errors for any validation problems.
	*/
	addEvent: function(data, defer_sort) {
		var event_id = this._assignID(data);

		if (typeof(data.start_date) == 'undefined') {
			throw(event_id + " is missing a start_date");
		} else {
			this._processDates(data);
			this._tidyFields(data);
		}

		this.events.push(data);
		this.event_dict[event_id] = data;

		if (!defer_sort) {
			VCO.DateUtil.sortByDate(this.events);
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
		if (!VCO.Util.trim(slide_id)) {
			// give it an ID if it doesn't have one
			slide_id = (slide.text) ? VCO.Util.slugify(slide.text.headline) : null;
		}
		// make sure it's unique and add it.
		slide.unique_id = VCO.Util.ensureUniqueKey(this.event_dict,slide_id);
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
			if (VCO.Util.trim(array[i].unique_id)) {
				array[i].unique_id = VCO.Util.slugify(array[i].unique_id); // enforce valid
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
					var slug = (array[i].text) ? VCO.Util.slugify(array[i].text.headline) : null;
					if (!slug) {
						slug = VCO.Util.unique_ID(6); // or generate a random ID
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
					var d = new VCO.BigDate(events[i].start_date);
					var year = d.data.date_obj.year;
					if(year < -271820 || year >  275759) {
						this.scale = "cosmological";
						break;
					}
				}
			}
		}
		var dateCls = VCO.DateUtil.SCALE_DATE_CLASSES[this.scale];
		if (!dateCls) { this.logError("Don't know how to process dates on scale "+this.scale); }
	},
	_processDates: function(slide) {
		var dateCls = VCO.DateUtil.SCALE_DATE_CLASSES[this.scale];
		if(!(slide.start_date instanceof dateCls)) {
			var start_date = slide.start_date;
			slide.start_date = new dateCls(start_date);

			// eliminate redundant end dates.
			if (typeof(slide.end_date) != 'undefined' && !(slide.end_date instanceof dateCls)) {
				var end_date = slide.end_date;
				var equal = true;
				for (property in start_date) {
					equal = equal && (start_date[property] == end_date[property]);
				}
				if (equal) {
					trace("End date same as start date is redundant; dropping end date");
					delete slide.end_date;
				} else {
					slide.end_date = new dateCls(end_date);
				}

			}
		}

	},

	_tidyFields: function(slide) {

		function fillIn(obj,key,default_value) {
			if (!default_value) default_value = '';
			if (!obj.hasOwnProperty(key)) { obj[key] = default_value }
		}

		if (slide.group) {
			slide.group = VCO.Util.trim(slide.group);
		}

		if (!slide.text) {
			slide.text = {};
		}
		fillIn(slide.text,'text');
		fillIn(slide.text,'headline');
	}
});
