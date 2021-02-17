import { mergeData } from "../core/Util"
import TLError from "../core/TLError"

import { TLDate, BigDate, BigYear, SCALES } from "../date/TLDate"
import { getBestHelper } from "./AxisHelper"

// Date Format Lookup, map TLDate.SCALES names to...
const AXIS_TICK_DATEFORMAT_LOOKUP = {
    millisecond: 'time_milliseconds', // ...Language.<code>.dateformats
    second: 'time_short',
    minute: 'time_no_seconds_short',
    hour: 'time_no_minutes_short',
    day: 'full_short',
    month: 'month_short',
    year: 'year',
    decade: 'year',
    century: 'year',
    millennium: 'year',
    age: 'compact', // ...Language.<code>.bigdateformats
    epoch: 'compact',
    era: 'compact',
    eon: 'compact',
    eon2: 'compact'
}

export class TimeScale {

    constructor(timeline_config, options) {

        var slides = timeline_config.events;
        this._scale = timeline_config.scale;

        options = mergeData({ // establish defaults
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

        this._earliest = timeline_config.getEarliestDate().getTime();
        this._latest = timeline_config.getLatestDate().getTime();
        this._span_in_millis = this._latest - this._earliest;
        if (this._span_in_millis <= 0) {
            this._span_in_millis = this._computeDefaultSpan(timeline_config);
        }
        this._average = (this._span_in_millis) / slides.length;

        this._pixels_per_milli = this.getPixelWidth() / this._span_in_millis;

        this._axis_helper = getBestHelper(this);

        this._scaled_padding = (1 / this.getPixelsPerTick()) * (this._display_width / 2)
        this._computePositionInfo(slides, options.max_rows);
    }

    _computeDefaultSpan(timeline_config) {
        // this gets called when all events are at the same instant,
        // or maybe when the span_in_millis is > 0 but still below a desired threshold
        if (timeline_config.scale == 'human') {
            var formats = {}
            for (var i = 0; i < timeline_config.events.length; i++) {
                var fmt = timeline_config.events[i].start_date.findBestFormat();
                formats[fmt] = (formats[fmt]) ? formats[fmt] + 1 : 1;
            };

            for (var i = SCALES.length - 1; i >= 0; i--) {
                if (formats.hasOwnProperty(SCALES[i][0])) {
                    var scale = SCALES[SCALES.length - 1]; // default
                    if (SCALES[i + 1]) {
                        scale = SCALES[i + 1]; // one larger than the largest in our data
                    }
                    return scale[1]
                }
            };
            return 365 * 24 * 60 * 60 * 1000; // default to a year?
        }

        return 200000; // what is the right handling for cosmo dates?
    }
    getGroupLabels() {
        /*
               return an array of objects, one per group, in the order (top to bottom) that the groups are expected to appear. Each object will have two properties:
                   * label (the string as specified in one or more 'group' properties of events in the configuration)
                   * rows (the number of rows occupied by events associated with the label. )
               */
        return (this._group_labels || []);
    }

    getScale() {
        return this._scale;
    }

    getNumberOfRows() {
        return this._number_of_rows
    }

    getPixelWidth() {
        return this._pixel_width;
    }

    getPosition(time_in_millis) {
        // be careful using millis, as they won't scale to cosmological time.
        // however, we're moving to make the arg to this whatever value
        // comes from TLDate.getTime() which could be made smart about that --
        // so it may just be about the naming.
        return (time_in_millis - this._earliest) * this._pixels_per_milli
    }

    getPositionInfo(idx) {
        return this._positions[idx];
    }

    getPixelsPerTick() {
        return this._axis_helper.getPixelsPerTick(this._pixels_per_milli);
    }

    getTicks() {
        return {
            major: this._axis_helper.getMajorTicks(this),
            minor: this._axis_helper.getMinorTicks(this)
        }
    }

    getDateFromTime(t) {
        if (this._scale == 'human') {
            return new TLDate(t);
        } else if (this._scale == 'cosmological') {
            return new BigDate(new BigYear(t));
        }
        throw new TLError("time_scale_scale_err", this._scale);
    }

    getMajorScale() {
        return this._axis_helper.major.name;
    }

    getMinorScale() {
        return this._axis_helper.minor.name;
    }

    _assessGroups(slides) {
        var groups = [];
        var empty_group = false;
        for (var i = 0; i < slides.length; i++) {
            if (slides[i].group) {
                if (groups.indexOf(slides[i].group) < 0) {
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
    }

    /*  Compute the marker row positions, minimizing the number of
        overlaps.

        @positions = list of objects from this._positions
        @rows_left = number of rows available (assume > 0)
    */
    _computeRowInfo(positions, rows_left) {
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
                if (overlaps[j] <= 0) {
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

        return { n_rows: lasts_in_row.length, n_overlaps: n_overlaps };
    }

    /*  Compute marker positions.  If using groups, this._number_of_rows
        will never be less than the number of groups.

        @max_rows = total number of available rows
        @default_marker_width should be in pixels
    */
    _computePositionInfo(slides, max_rows, default_marker_width) {
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

            if (slides[i].group) {
                if (groups.indexOf(slides[i].group) < 0) {
                    groups.push(slides[i].group);
                }
            } else {
                empty_group = true;
            }
        }

        if (!(groups.length)) {
            var result = this._computeRowInfo(this._positions, max_rows);
            this._number_of_rows = result.n_rows;
        } else {
            if (empty_group) {
                groups.push("");
            }

            // Init group info
            var group_info = [];

            for (var i = 0; i < groups.length; i++) {
                group_info[i] = {
                    label: groups[i],
                    idx: i,
                    positions: [],
                    n_rows: 1, // default
                    n_overlaps: 0
                };
            }

            for (var i = 0; i < this._positions.length; i++) {
                var pos_info = this._positions[i];

                pos_info.group = groups.indexOf(slides[i].group || "");
                pos_info.row = 0;

                var gi = group_info[pos_info.group];
                for (var j = gi.positions.length - 1; j >= 0; j--) {
                    if (gi.positions[j].end > pos_info.start) {
                        gi.n_overlaps++;
                    }
                }

                gi.positions.push(pos_info);
            }

            var n_rows = groups.length; // start with 1 row per group

            while (true) {
                // Count free rows available
                var rows_left = Math.max(0, max_rows - n_rows);
                if (!rows_left) {
                    break; // no free rows, nothing to do
                }

                // Sort by # overlaps, idx
                group_info.sort(function(a, b) {
                    if (a.n_overlaps > b.n_overlaps) {
                        return -1;
                    } else if (a.n_overlaps < b.n_overlaps) {
                        return 1;
                    }
                    return a.idx - b.idx;
                });
                if (!group_info[0].n_overlaps) {
                    break; // no overlaps, nothing to do
                }

                // Distribute free rows among groups with overlaps
                var n_rows = 0;
                for (var i = 0; i < group_info.length; i++) {
                    var gi = group_info[i];

                    if (gi.n_overlaps && rows_left) {
                        var res = this._computeRowInfo(gi.positions, gi.n_rows + 1);
                        gi.n_rows = res.n_rows; // update group info
                        gi.n_overlaps = res.n_overlaps;
                        rows_left--; // update rows left
                    }

                    n_rows += gi.n_rows; // update rows used
                }
            }

            // Set number of rows
            this._number_of_rows = n_rows;

            // Set group labels; offset row positions
            this._group_labels = [];

            group_info.sort(function(a, b) { return a.idx - b.idx; });

            for (var i = 0, row_offset = 0; i < group_info.length; i++) {
                this._group_labels.push({
                    label: group_info[i].label,
                    rows: group_info[i].n_rows
                });

                for (var j = 0; j < group_info[i].positions.length; j++) {
                    var pos_info = group_info[i].positions[j];
                    pos_info.row += row_offset;
                }

                row_offset += group_info[i].n_rows;
            }
        }

    }




    /**
     * To handle formatting cosmological ticks correctly, let the TimeScale (which knows)
     * give us the format for tick labels on the time axis.
     * @param {String} name - the "level" of dates in the axis
     */
    getAxisTickDateFormat(name) {
        if (this._scale == 'cosmological') {
            return 'compact' // is this heavy-handed? cosmologic
        }

        return AXIS_TICK_DATEFORMAT_LOOKUP[name]

    }
}