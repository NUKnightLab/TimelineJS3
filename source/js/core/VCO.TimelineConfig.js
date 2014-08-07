/*  VCO.TimelineConfig
    separate the configuration from the display (VCO.Timeline)
    to make testing easier
================================================== */
VCO.TimelineConfig = VCO.Class.extend({
    initialize: function (data, callback) {
    // Initialize the data
        this.data = {}
        trace("VCO.TimelineConfig.initialize")
        if (typeof data === 'string') {
            var self = this;
            trace("string");
            
            VCO.ajax({
                type: 'GET',
                url: data,
                dataType: 'json', //json data type
                success: function(d){
                    if (d && d.timeline) {
                        VCO.Util.mergeData(self.data, d.timeline);
                    } else {
                        throw("data must have a timeline property")
                    }
                    self._cleanData();
                    VCO.DateUtil.sortByDate(self.data.slides);
                    if (callback) {
                        callback(self);
                    }
                },
                error:function(xhr, type){
                    trace("ERROR LOADING");
                    trace(xhr);
                    trace(type);
                }
            });
        } else if (typeof data === 'object') {
            if (data.timeline) {
                this.data = data.timeline;
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

    _cleanData: function() {
        this._makeUniqueIdentifiers(this.data.slides); 
        this._processDates(this.data.slides);          
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
                    var slug = VCO.Util.slugify(array[i].text.headline);
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
        for (var i = 0; i < array.length; i++) {
            array[i].date = new VCO.Date(array[i].date);
        }
    }
});
