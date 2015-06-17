/*  VCO.TimelineConfig
separate the configuration from the display (VCO.Timeline)
to make testing easier
================================================== */
VCO.TimelineConfig = VCO.Class.extend({
	
	includes: [VCO.Events],
	VALID_PROPERTIES: ['scale', 'title', 'events'], // we'll only pull things in from this

	initialize: function (data, callback) {
		// Initialize the data
		if (typeof data === 'string') {
			var self = this;
            
			VCO.ajax({
				type: 'GET',
				url: data,
				dataType: 'json', //json data type
				success: function(d){
					if (d && d.events) {
						self._importProperties(d);
					} else {
						this.fire("load_error", {message:"data must have an events property"});
						throw("data must have an events property");
					}
					self._cleanData();
					if (callback) {
						callback(self);
					}
				},
				error:function(xhr, type){
					trace(xhr);
					trace(type);
					this.fire("load_error", {message:"Configuration could not be loaded: " + type});
					throw("Configuration could not be loaded: " + type);
					
				}
			});
		} else if (typeof data === 'object') {
			if (data.events) {
				this._importProperties(data);
				this._cleanData();
			} else {
				this.fire("load_error", {message:"data must have an events property"});
				throw("data must have a events property");
			}
			if (callback) {
				callback(this);
			}
		} else {
			this.fire("load_error", {message:"Invalid Argument"});
			throw("Invalid Argument");
		}
	},

	/* Add an event and return the unique id 
	*/
	addEvent: function(data) {
		var _id = (this.title) ? this.title.uniqueid : '';
		this.events.push(data);
		this._makeUniqueIdentifiers(_id, this.events); 
		this._processDates(this.events);    
        
		var uniqueid = this.events[this.events.length - 1].uniqueid;             
		VCO.DateUtil.sortByDate(this.events);
		return uniqueid;
	},

	_cleanData: function() {
		var _id = (this.title) ? this.title.uniqueid : '';
		this._makeUniqueIdentifiers(_id, this.events); 
		this._processDates(this.events);          
		VCO.DateUtil.sortByDate(this.events);
	},
    
	_importProperties: function(d) {
		for (var i = 0; i < this.VALID_PROPERTIES.length; i++) {
			k = this.VALID_PROPERTIES[i];
			this[k] = d[k];
		}
        
		// Make sure title slide has unique id
		if(this.title && !('uniqueid' in this.title)) {
			this.title.uniqueid = '';
		}
	},

	_makeUniqueIdentifiers: function(title_id, array) {
		var used = [title_id];
		for (var i = 0; i < array.length; i++) {
			if (array[i].uniqueid && array[i].uniqueid.replace(/\s+/,'').length > 0) {
				array[i].uniqueid = VCO.Util.slugify(array[i].uniqueid); // enforce valid
				if (used.indexOf(array[i].uniqueid) != -1) {
					array[i].uniqueid = '';
				} else {
					used.push(array[i].uniqueid);
				}
			}
		};
		if (used.length != (array.length + 1)) {
			for (var i = 0; i < array.length; i++) {
				if (!array[i].uniqueid) {
					var slug = (array[i].text) ? VCO.Util.slugify(array[i].text.headline) : null;
					if (!slug) {
						slug = VCO.Util.unique_ID(6);
					}
					if (used.indexOf(slug) != -1) {
						slug = slug + '-' + i;
					}
					used.push(slug);
					array[i].uniqueid = slug;
				}
			}
		}
	},

	_processDates: function(array) {
		var dateCls = null;
        
		if(!this.scale) {
			trace("Determining scale dynamically");
            
			this.scale = "javascript"; // default
            
			for (var i = 0; i < array.length; i++) {
				if (typeof(array[i].start_date) == 'undefined') {
					this.fire("load_error", {message:"item " + i + " is missing a start_date"});
					throw("item " + i + " is missing a start_date");
				}
                
				var d = new VCO.BigDate(array[i].start_date);
				var year = d.data.date_obj.year;               
				if(year < -271820 || year >  275759) {
					this.scale = "cosmological";
					break;
				}
			}
		}
        
		if(this.scale == 'javascript') {
			dateCls = VCO.Date;
			trace('using VCO.Date');
		} else if(this.scale == 'cosmological') {
			dateCls = VCO.BigDate;
			trace('using VCO.BigDate');
		} else {
			this.fire("load_error", {message:"Don't know how to process dates on scale "+this.scale});
			throw ("Don't know how to process dates on scale "+this.scale);
		}
            
		for (var i = 0; i < array.length; i++) {
			if (typeof(array[i].start_date) == 'undefined') {
				this.fire("load_error", {message:"item " + i + " is missing a start_date"});
				throw("item " + i + " is missing a start_date");
				
			}
			if(!(array[i].start_date instanceof dateCls)) {
				var start_date = array[i].start_date;
				array[i].start_date = new dateCls(start_date);

				// eliminate redundant end dates.
				if (typeof(array[i].end_date) != 'undefined' && !(array[i].end_date instanceof dateCls)) {
					var end_date = array[i].end_date;
					var equal = true;
					for (property in start_date) {
						equal = equal && (start_date[property] == end_date[property]);
					}
					if (equal) {
						trace("End date same as start date is redundant; dropping end date");
						delete array[i].end_date;
					} else {
						array[i].end_date = new dateCls(end_date);
					}

				}
			}
		}
	}
});
