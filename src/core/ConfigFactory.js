import { TimelineConfig } from "../core/TimelineConfig"
import { trim, isEmptyObject, mergeData, trace } from "../core/Util";
import { TLDate } from "../date/TLDate"
import TLError from "../core/TLError"
import { ajax } from "../net/Net"
import { parseTime } from "../date/DateUtil"

export function parseGoogleSpreadsheetURL(url) {
    let parts = {
        key: null,
        worksheet: 0 // not really sure how to use this to get the feed for that sheet, so this is not ready except for first sheet right now
    }
    // key as url parameter (old-fashioned)
    var key_pat = /\bkey=([-_A-Za-z0-9]+)&?/i;
    var url_pat = /docs.google.com\/spreadsheets(.*?)\/d\//; // fixing issue of URLs with u/0/d

    if (url.match(key_pat)) {
        parts.key = url.match(key_pat)[1];
        // can we get a worksheet from this form?
    } else if (url.match(url_pat)) {
        var pos = url.search(url_pat) + url.match(url_pat)[0].length;
        var tail = url.substr(pos);
        parts.key = tail.split('/')[0]
        if (url.match(/\?gid=(\d+)/)) {
            parts.worksheet = url.match(/\?gid=(\d+)/)[1];
        }
    } else if (url.match(/^\b[-_A-Za-z0-9]+$/)) {
        parts.key = url;
    }

    if (parts.key) {
        return parts;
    } else {
        return null;
    }
}

function extractGoogleEntryData_V1(item) {
    var item_data = {}
    for (let k in item) {
        if (k.indexOf('gsx$') == 0) {
            item_data[k.substr(4)] = item[k].$t;
        }
    }
    if (isEmptyObject(item_data)) return null;
    var d = {
        media: {
            caption: item_data.mediacaption || '',
            credit: item_data.mediacredit || '',
            url: item_data.media || '',
            thumbnail: item_data.mediathumbnail || ''
        },
        text: {
            headline: item_data.headline || '',
            text: item_data.text || ''
        },
        group: item_data.tag || '',
        type: item_data.type || ''
    }
    if (item_data.startdate) {
        d['start_date'] = TLDate.parseDate(item_data.startdate);
    }
    if (item_data.enddate) {
        d['end_date'] = TLDate.parseDate(item_data.enddate);
    }


    return d;
}

function extractGoogleEntryData_V3(item) {

    function clean_integer(s) {
        if (s) {
            return s.replace(/[\s,]+/g, ''); // doesn't handle '.' as comma separator, but how to distinguish that from decimal separator?
        }
    }

    var item_data = {}
    for (let k in item) {
        if (k.indexOf('gsx$') == 0) {
            item_data[k.substr(4)] = trim(item[k].$t);
        }
    }
    if (isEmptyObject(item_data)) return null;
    var d = {
        media: {
            caption: item_data.mediacaption || '',
            credit: item_data.mediacredit || '',
            url: item_data.media || '',
            thumbnail: item_data.mediathumbnail || ''
        },
        text: {
            headline: item_data.headline || '',
            text: item_data.text || ''
        },
        start_date: {
            year: clean_integer(item_data.year),
            month: clean_integer(item_data.month) || '',
            day: clean_integer(item_data.day) || ''
        },
        end_date: {
            year: clean_integer(item_data.endyear) || '',
            month: clean_integer(item_data.endmonth) || '',
            day: clean_integer(item_data.endday) || ''
        },
        display_date: item_data.displaydate || '',

        type: item_data.type || ''
    }

    if (item_data.time) {
        mergeData(d.start_date, parseTime(item_data.time));
    }

    if (item_data.endtime) {
        mergeData(d.end_date, parseTime(item_data.endtime));
    }


    if (item_data.group) {
        d.group = item_data.group;
    }

    if (d.end_date.year == '') {
        var bad_date = d.end_date;
        delete d.end_date;
        if (bad_date.month != '' || bad_date.day != '' || bad_date.time != '') {
            var label = d.text.headline ||
                trace("Invalid end date for spreadsheet row. Must have a year if any other date fields are specified.");
            trace(item);
        }
    }

    if (item_data.background) {
        if (item_data.background.match(/^(https?:)?\/\/?/)) { // support http, https, protocol relative, site relative
            d['background'] = { 'url': item_data.background }
        } else { // for now we'll trust it's a color
            d['background'] = { 'color': item_data.background }
        }
    }

    return d;
}



var getGoogleItemExtractor = function (data) {
    if (typeof data.feed.entry === 'undefined'
        || data.feed.entry.length == 0) {
        throw new TLError("empty_feed_err");
    }
    var entry = data.feed.entry[0];

    if (typeof entry.gsx$startdate !== 'undefined') {
        // check headers V1
        // var headers_V1 = ['startdate', 'enddate', 'headline','text','media','mediacredit','mediacaption','mediathumbnail','media','type','tag'];
        // for (var i = 0; i < headers_V1.length; i++) {
        //     if (typeof entry['gsx$' + headers_V1[i]] == 'undefined') {
        //         throw new TLError("invalid_data_format_err");
        //     }
        // }
        return extractGoogleEntryData_V1;
    } else if (typeof entry.gsx$year !== 'undefined') {
        // check rest of V3 headers
        var headers_V3 = ['month', 'day', 'time', 'endmonth', 'endyear', 'endday', 'endtime', 'displaydate', 'headline', 'text', 'media', 'mediacredit', 'mediacaption', 'mediathumbnail', 'type', 'group', 'background'];
        // for (var i = 0; i < headers_V3.length; i++) {
        //     if (typeof entry['gsx$' + headers_V3[i]] == 'undefined') {
        //         throw new TLError("invalid_data_format_err");
        //     }
        // }
        return extractGoogleEntryData_V3;
    }
    throw new TLError("invalid_data_format_err");
}

var buildGoogleFeedURL = function (key, api_version) {
    if (api_version == 'v4') {
        return "https://sheets.googleapis.com/v4/spreadsheets/" + key + "/values/A1:R1000?key=AIzaSyCInR0kjJJ2Co6aQAXjLBQ14CEHam3K0xg";
    } else {
        return "https://spreadsheets.google.com/feeds/list/" + key + "/1/public/values?alt=json";
    }
}

var jsonFromGoogleURL = function (google_url) {
    var api_version = 'v3';
    var parts = parseGoogleSpreadsheetURL(google_url);
    if (parts && parts.key) {
        var spreadsheet_key = parts.key;
    } else {
        throw new TLError('invalid_url_err', google_url);
    }

    var url = buildGoogleFeedURL(spreadsheet_key, api_version);

    var response = ajax({
        url: url,
        async: false
    });

    // tricky because errors can be in the response object or in the parsed data...

    if (response.status != 200) {
        console.log("Error fetching data " + api_version + ": " + response.status + " - " + response.statusText);
        api_version = 'v4';
        var url = buildGoogleFeedURL(spreadsheet_key, api_version);
        console.log("trying v4 - " + google_url);
        var response = ajax({
            url: url,
            async: false
        });

        if (response.status == 403) {
            throw new TLError('invalid_url_share_required');
        } else if (response.status != 200) {
            var msg = "Error fetching data " + api_version + ": " + response.status + " - " + response.statusText;
            console.log(msg);
            throw new TLError("google_error", msg);
        }
    }


    var data = JSON.parse(response.responseText);

    if (data.error) {
        var msg = "Error fetching data " + api_version + ": " + response.status + " - " + response.statusText;
        console.log(msg);
        console.log(data.error);
        throw new TLError("google_error", msg);
    }

    return googleFeedJSONtoTimelineJSON(data);
}

function extractGoogleEntryData_V4(column, item) {
    function clean_integer(s) {
        if (s) {
            return s.replace(/[\s,]+/g, ''); // doesn't handle '.' as comma separator, but how to distinguish that from decimal separator?
        }
    }
    // console.log(item);
    var item_data = {};
    for (var i = 1; i < item.length; i++) {
        if (column.length >= i) {
            var column_name = column[i].toLowerCase().replace(" ", "");
            item_data[column_name] = item[i];
        }

    }

    var event = {
        media: {
            caption: item_data.mediacaption || '',
            credit: item_data.mediacredit || '',
            url: item_data.media || '',
            thumbnail: item_data.mediathumbnail || ''
        },
        text: {
            headline: item_data.headline || '',
            text: item_data.text || ''
        },
        start_date: {
            year: clean_integer(item[0]),
            month: clean_integer(item[1]) || '',
            day: clean_integer(item[2]) || ''
        },
        end_date: {
            year: clean_integer(item_data.endyear) || '',
            month: clean_integer(item_data.endmonth) || '',
            day: clean_integer(item_data.endday) || ''
        },
        display_date: item_data.displaydate || '',

        type: item_data.type || ''
    }


    if (item_data.time) {
        mergeData(event.start_date, parseTime(item[3]));
    }

    if (item_data.endtime) {
        mergeData(event.end_date, parseTime(item_data.endtime));
    }

    if (item_data.group) {
        event.group = item_data.group;
    }

    if (event.end_date.year == '') {
        var bad_date = event.end_date;
        delete event.end_date;
        if (bad_date.month != '' || bad_date.day != '' || bad_date.time != '') {
            var label = event.text.headline ||
                trace("Invalid end date for spreadsheet row. Must have a year if any other date fields are specified.");
            trace(item);
        }
    }

    if (item_data.background) {
        if (item_data.background.match(/^(https?:)?\/\/?/)) { // support http, https, protocol relative, site relative
            event['background'] = { 'url': item_data.background }
        } else { // for now we'll trust it's a color
            event['background'] = { 'color': item_data.background }
        }
    }

    return event;
}

var googleFeedJSONtoTimelineJSON = function (data) {
    var timeline_config = { 'events': [], 'errors': [], 'warnings': [], 'eras': [] }

    if (data.values) {
        // Google Sheets API v4
        for (var i = 1; i < data.values.length; i++) {
            var event = extractGoogleEntryData_V4(data.values[0], data.values[i]);
            if (event) { // blank rows return null
                var row_type = 'event';
                if (typeof (event.type) != 'undefined') {
                    row_type = event.type;
                    delete event.type;
                }
                if (row_type == 'title') {
                    if (!timeline_config.title) {
                        timeline_config.title = event;
                    } else {
                        timeline_config.warnings.push("Multiple title slides detected.");
                        timeline_config.events.push(event);
                    }
                } else if (row_type == 'era') {
                    timeline_config.eras.push(event);
                } else {
                    timeline_config.events.push(event);
                }
            }
        }
    } else {

        // Google Sheets API v3 
        var extract = getGoogleItemExtractor(data);
        for (var i = 0; i < data.feed.entry.length; i++) {
            try {
                var event = extract(data.feed.entry[i]);
                if (event) { // blank rows return null
                    var row_type = 'event';
                    if (typeof (event.type) != 'undefined') {
                        row_type = event.type;
                        delete event.type;
                    }
                    if (row_type == 'title') {
                        if (!timeline_config.title) {
                            timeline_config.title = event;
                        } else {
                            timeline_config.warnings.push("Multiple title slides detected.");
                            timeline_config.events.push(event);
                        }
                    } else if (row_type == 'era') {
                        timeline_config.eras.push(event);
                    } else {
                        timeline_config.events.push(event);
                    }
                }
            } catch (e) {
                if (e.message) {
                    e = e.message;
                }
                timeline_config.errors.push(e + " [" + i + "]");
            }
        };

    }

    return timeline_config;

}

export function makeConfig(url, callback) {
    var tc,
        key = parseGoogleSpreadsheetURL(url);

    if (key) {
        try {
            var json = jsonFromGoogleURL(url);
        } catch (e) {
            tc = new TimelineConfig();
            if (e.name == 'NetworkError') {
                tc.logError(new TLError("network_err"));
            } else if (e.name == 'TLError') {
                tc.logError(e);
            } else {
                tc.logError(new TLError("unknown_read_err", e.name));
            }
            callback(tc);
            return;
        }
        tc = new TimelineConfig(json);
        if (json.errors) {
            for (var i = 0; i < json.errors.length; i++) {
                tc.logError(json.errors[i]);
            };
        }
        callback(tc);
    } else {
        ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                try {
                    tc = new TimelineConfig(data);
                } catch (e) {
                    tc = new TimelineConfig();
                    tc.logError(e);
                }
                callback(tc);
            },
            error: function (xhr, errorType, error) {
                tc = new TimelineConfig();
                if (errorType == 'parsererror') {
                    var error = new TLError("invalid_url_err");
                } else {
                    var error = new TLError("unknown_read_err", errorType)
                }
                tc.logError(error);
                callback(tc);
            }
        });

    }
}

// // export for unit testing
// googleFeedJSONtoTimelineJSON: googleFeedJSONtoTimelineJSON,
