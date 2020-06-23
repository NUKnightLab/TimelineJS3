import TLError from "../core/TLError"

import { TLDate, BigDate } from "../date/TLDate"
import { trim } from "../core/Util"

export function sortByDate(array, prop_name) { // only for use with slide data objects
    var prop_name = prop_name || 'start_date';
    array.sort(function(a, b) {
        if (a[prop_name].isBefore(b[prop_name])) return -1;
        if (a[prop_name].isAfter(b[prop_name])) return 1;
        return 0;
    });
}

export function parseTime(time_str) {
    var parsed = {
        hour: null,
        minute: null,
        second: null,
        millisecond: null // conform to keys in TLDate
    }
    var period = null;
    var match = time_str.match(/(\s*[AaPp]\.?[Mm]\.?\s*)$/);
    if (match) {
        period = trim(match[0]);
        time_str = trim(time_str.substring(0, time_str.lastIndexOf(period)));
    }

    var parts = [];
    var no_separators = time_str.match(/^\s*(\d{1,2})(\d{2})\s*$/);
    if (no_separators) {
        parts = no_separators.slice(1);
    } else {
        parts = time_str.split(':');
        if (parts.length == 1) {
            parts = time_str.split('.');
        }
    }

    if (parts.length > 4) {
        throw new TLError("invalid_separator_error");
    }

    parsed.hour = parseInt(parts[0]);

    if (period && period.toLowerCase()[0] == 'p' && parsed.hour != 12) {
        parsed.hour += 12;
    } else if (period && period.toLowerCase()[0] == 'a' && parsed.hour == 12) {
        parsed.hour = 0;
    }


    if (isNaN(parsed.hour) || parsed.hour < 0 || parsed.hour > 23) {
        throw new TLError("invalid_hour_err", parsed.hour);
    }

    if (parts.length > 1) {
        parsed.minute = parseInt(parts[1]);
        if (isNaN(parsed.minute)) {
            throw new TLError("invalid_minute_err", parsed.minute);
        }
    }

    if (parts.length > 2) {
        var sec_parts = parts[2].split(/[\.,]/);
        parts = sec_parts.concat(parts.slice(3)) // deal with various methods of specifying fractional seconds
        if (parts.length > 2) {
            throw new TLError("invalid_second_fractional_err");
        }
        parsed.second = parseInt(parts[0]);
        if (isNaN(parsed.second)) {
            throw new TLError("invalid_second_err");
        }
        if (parts.length == 2) {
            var frac_secs = parseInt(parts[1]);
            if (isNaN(frac_secs)) {
                throw new TLError("invalid_fractional_err");
            }
            parsed.millisecond = 100 * frac_secs;
        }
    }

    return parsed;
}

export const SCALE_DATE_CLASSES = {
    human: TLDate,
    cosmological: BigDate
}