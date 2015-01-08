/*  VCO.TimelineConfig
    separate the configuration from the display (VCO.Timeline)
    to make testing easier
================================================== */
VCO.TimelineConfig = VCO.Class.extend({
    VALID_PROPERTIES: ['scale', 'slides'], // we'll only pull things in from this

    initialize: function (data, callback) {
    // Initialize the data
        if (typeof data === 'string') {
            var self = this;
            
            VCO.ajax({
                type: 'GET',
                url: data,
                dataType: 'json', //json data type
                success: function(d){
                    if (d && d.timeline) {
                        self._importProperties(d.timeline);
                    } else {
                        throw("data must have a timeline property")
                    }
                    self._cleanData();
                    if (callback) {
                        callback(self);
                    }
                },
                error:function(xhr, type){
                    trace(xhr);
                    trace(type);
                    throw("Configuration could not be loaded: " + type);
                }
            });
        } else if (typeof data === 'object') {
            if (data.timeline) {
                this._importProperties(data.timeline);
                this._cleanData();
            } else {
                throw("data must have a timeline property")
            }
            if (callback) {
                callback(this);
            }
        } else {
            throw("Invalid Argument");
        }
    },

    /* Add a slide and return the unique id 
    */
    addSlide: function(data) {
        this.slides.push(data);
        this._makeUniqueIdentifiers(this.slides); 
        this._processDates(this.slides);    
        
        var uniqueid = this.slides[this.slides.length - 1].uniqueid;             
        VCO.DateUtil.sortByDate(this.slides);
        return uniqueid;
    },

    _cleanData: function() {
        this._makeUniqueIdentifiers(this.slides); 
        this._processDates(this.slides);          
        VCO.DateUtil.sortByDate(this.slides);
    },
    
    _importProperties: function(d) {
        for (var i = 0; i < this.VALID_PROPERTIES.length; i++) {
            k = this.VALID_PROPERTIES[i];
            this[k] = d[k];
        }
    },

    _makeUniqueIdentifiers: function(array) {
        var used = []
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
        if (used.length != array.length) {
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
            throw ("Don't know how to process dates on scale "+this.scale);
        }
            
        for (var i = 0; i < array.length; i++) {
            if (typeof(array[i].start_date) == 'undefined') {
                throw("item " + i + " is missing a start_date");
            }
            if(!(array[i].start_date instanceof dateCls)) {
                array[i].start_date = new dateCls(array[i].start_date);
                if (typeof(array[i].end_date) != 'undefined') {
                    array[i].end_date = new dateCls(array[i].end_date);
                }
            }
        }
    }
});
