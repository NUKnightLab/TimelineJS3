/*  VCO.TimeScale
    Strategies for laying out the timenav
    make a new one if the slides change

    TODOS: deal with clustering 
================================================== */
VCO.TimeScale = VCO.Class.extend({
    
    initialize: function (timeline_config, options) {
        timeline_config = VCO.Util.extend({ // establish defaults
            scale: 'javascript'
        }, timeline_config);

        var slides = timeline_config.events;
        this._scale = timeline_config.scale;

        options = VCO.Util.extend({ // establish defaults
            display_width: 500,
            screen_multiplier: 3,
            max_rows: null
        }, options);

        this._display_width = options.display_width;
        this._screen_multiplier = options.screen_multiplier;
        this._pixel_width = this._screen_multiplier * this._display_width;

        this._group_labels = undefined;
        this._positions = [];
        this._pixels_per_milli = 0;
        
        this._earliest = slides[0].start_date.getTime();
        // TODO: should _latest be the end date if there is one?
        this._latest = slides[slides.length - 1].start_date.getTime();
        this._span_in_millis = this._latest - this._earliest;
        this._average = (this._span_in_millis)/slides.length;

        this._pixels_per_milli = this.getPixelWidth() / this._span_in_millis;

        this._axis_helper = VCO.AxisHelper.getBestHelper(this);

        this._scaled_padding = (1/this.getPixelsPerTick()) * (this._display_width/2)
        this._computePositionInfo(slides, options.max_rows);
    },
    
    getGroupLabels: function() { /* 
        return an array of objects, one per group, in the order (top to bottom) that the groups are expected to appear. Each object will have two properties:
            * label (the string as specified in one or more 'group' properties of events in the configuration)
            * rows (the number of rows occupied by events associated with the label. ) 
        */
        return (this._group_labels || []);
    },
    
    getScale: function() {
        return this._scale;
    },
    
    getNumberOfRows: function() {
        return this._number_of_rows
    },

    getPixelWidth: function() {
        return this._pixel_width;
    },

    getPosition: function(time_in_millis) {
        // be careful using millis, as they won't scale to cosmological time.
        // however, we're moving to make the arg to this whatever value 
        // comes from VCO.Date.getTime() which could be made smart about that -- 
        // so it may just be about the naming.
        return ( time_in_millis - this._earliest ) * this._pixels_per_milli
    },

    getPositionInfo: function(idx) {
        return this._positions[idx];
    },

    getPixelsPerTick: function() {
        return this._axis_helper.getPixelsPerTick(this._pixels_per_milli);
    },

    getTicks: function() {
        return { 
            major: this._axis_helper.getMajorTicks(this), 
            minor: this._axis_helper.getMinorTicks(this) }
    },

    getDateFromTime: function(t) {
        if(this._scale == 'javascript') {
            return new VCO.Date(t);
        } else if(this._scale == 'cosmological') {
            return new VCO.BigDate(new VCO.BigYear(t));
        }  
        
        throw("Don't know how to get date from time for "+this._scale);
    },
    
    getMajorScale: function() {
        return this._axis_helper.major.name;
    },
    
    getMinorScale: function() {
        return this._axis_helper.minor.name;
    },

    _assessGroups: function(slides) {
        var groups = [];
        var empty_group = false;
        for (var i = 0; i < slides.length; i++) {
            if(slides[i].group) {
                if(groups.indexOf(slides[i].group) < 0) {
                    groups.push(slides[i].group);
                } else {
                    empty_group = true;
                }            
            } 
        };
        if (groups.length && empty_group) {
            groups.push('');
        }
        return groups;
    },

    /*  Compute the marker row positions, minimizing the number of
        overlaps.
        
        @positions = list of objects from this._positions
        @rows_left = number of rows available (assume > 0)
    */
    _computeRowInfo: function(positions, rows_left) {
        var lasts_in_row = [];
        var n_overlaps = 0;
        
        for (var i = 0; i < positions.length; i++) {
            var pos_info = positions[i];      
            var overlaps = [];
                       
            // See if we can add item to an existing row without 
            // overlapping the previous item in that row      
            delete pos_info.row;
             
            for (var j = 0; j < lasts_in_row.length; j++) {
                overlaps.push(lasts_in_row[j].end - pos_info.start);
                if(overlaps[j] <= 0) {
                    pos_info.row = j;
                    lasts_in_row[j] = pos_info;
                    break;
                }                        
            }
            
            // If we couldn't add to an existing row without overlap...
            if (typeof(pos_info.row) == 'undefined') {    
                if (rows_left === null) {
                    // Make a new row
                    pos_info.row = lasts_in_row.length;
                    lasts_in_row.push(pos_info);                  
                } else if (rows_left > 0) {
                    // Make a new row
                    pos_info.row = lasts_in_row.length;
                    lasts_in_row.push(pos_info);  
                    rows_left--;
                } else {
                    // Add to existing row with minimum overlap.
                    var min_overlap = Math.min.apply(null, overlaps);
                    var idx = overlaps.indexOf(min_overlap);                   
                    pos_info.row = idx;
                    if (pos_info.end > lasts_in_row[idx].end) {
                        lasts_in_row[idx] = pos_info;                                          
                    }
                    n_overlaps++;
                }                        
            }   
        }   
        
        return {n_rows: lasts_in_row.length, n_overlaps: n_overlaps};
    },   

    /*  Compute marker positions.  If using groups, this._number_of_rows
        will never be less than the number of groups.
        
        @max_rows = total number of available rows
        @default_marker_width should be in pixels
    */
    _computePositionInfo: function(slides, max_rows, default_marker_width) {
        default_marker_width = default_marker_width || 100;
        
        var groups = [];
        var empty_group = false;

        // Set start/end/width; enumerate groups
        for (var i = 0; i < slides.length; i++) {
            var pos_info = {
                start: this.getPosition(slides[i].start_date.getTime()) 
            };
            this._positions.push(pos_info);
            
            if (typeof(slides[i].end_date) != 'undefined') {
                var end_pos = this.getPosition(slides[i].end_date.getTime());
                pos_info.width = end_pos - pos_info.start;
                if (pos_info.width > default_marker_width) {
                    pos_info.end = pos_info.start + pos_info.width; 
                } else {
                    pos_info.end = pos_info.start + default_marker_width; 
                }
            } else {
                pos_info.width = default_marker_width;
                pos_info.end = pos_info.start + default_marker_width;
            }
            
            if(slides[i].group) {
                if(groups.indexOf(slides[i].group) < 0) {
                    groups.push(slides[i].group);
                }            
            } else {
                empty_group = true;
            }
        }

        if(groups.length) {                       
            if(empty_group) {
                groups.push("");
            }

            // Init group info
            var group_info = [];            
            
            for(var i = 0; i < groups.length; i++) {
                group_info[i] = {
                    label: groups[i],
                    idx: i,
                    positions: [], 
                    n_rows: 1,      // default
                    n_overlaps: 0
                };
            }       
                             
            for(var i = 0; i < this._positions.length; i++) {
                var pos_info = this._positions[i];
                                
                pos_info.group = groups.indexOf(slides[i].group || "");
                pos_info.row = 0;
                
                var gi = group_info[pos_info.group];
                for(var j = gi.positions.length - 1; j >= 0; j--) {
                    if(gi.positions[j].end > pos_info.start) {
                        gi.n_overlaps++;
                    }                   
                }   
                
                gi.positions.push(pos_info);                
            }
            
            var n_rows = groups.length; // start with 1 row per group
          
            while(true) {
                // Count free rows available              
                var rows_left = Math.max(0, max_rows - n_rows);                
                if(!rows_left) {
                    break;  // no free rows, nothing to do
                }

                // Sort by # overlaps, idx
               group_info.sort(function(a, b) {
                    if(a.n_overlaps > b.n_overlaps) {
                        return -1;
                    } else if(a.n_overlaps < b.n_overlaps) {
                        return 1;
                    } 
                    return a.idx - b.idx;
                });               
                if(!group_info[0].n_overlaps) {
                    break; // no overlaps, nothing to do
                }
                                                
                // Distribute free rows among groups with overlaps
                var n_rows = 0;
                for(var i = 0; i < group_info.length; i++) {
                    var gi = group_info[i];
                    
                    if(gi.n_overlaps && rows_left) {
                        var res = this._computeRowInfo(gi.positions,  gi.n_rows + 1);
                        gi.n_rows = res.n_rows;     // update group info
                        gi.n_overlaps = res.n_overlaps; 
                        rows_left--;                // update rows left
                    } 
                    
                    n_rows += gi.n_rows;            // update rows used          
                }
            } 
                        
            // Set number of rows
            this._number_of_rows = n_rows;
                                
            // Set group labels; offset row positions
            this._group_labels = [];
            
            group_info.sort(function(a, b) {return a.idx - b.idx; });               
            
            for(var i = 0, row_offset = 0; i < group_info.length; i++) {
                this._group_labels.push({
                    label: group_info[i].label,
                    rows: group_info[i].n_rows
                });   
                 
                for(var j = 0; j < group_info[i].positions.length; j++) {
                    var pos_info = group_info[i].positions[j];
                    pos_info.row += row_offset;
                }
                
                row_offset += group_info[i].n_rows;       
            }
        } else {
            var result = this._computeRowInfo(this._positions, max_rows);  
            this._number_of_rows = result.n_rows;    
        }  
        
    }
});
