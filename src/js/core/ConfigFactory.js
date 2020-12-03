import { TimelineConfig } from "../core/TimelineConfig"
import { trim, isEmptyObject, mergeData, trace } from "../core/Util";
import { parseDate } from "../date/TLDate"
import TLError from "../core/TLError"
import { ajax } from "../net/Net"
import { parseTime, validDateConfig } from "../date/DateUtil"
import { fetchCSV } from '../core/CSV';

function clean_integer(s) {
    if (s) {
        return s.replace(/[\s,]+/g, ''); // doesn't handle '.' as comma separator, but how to distinguish that from decimal separator?
    }
}

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


function interpretBackground(bkgd) {
    if (typeof(bkgd) != 'string') return ''
    if (bkgd.match(/^(https?:)?\/\/?/)) { // support http, https, protocol relative, site relative
        return { 'url': bkgd }
    } else { // for now we'll trust it's a color
        return { 'color': bkgd }
    }

}

function extractEventFromCSVObject(orig_row) {

    let row = {}
    Object.keys(orig_row).forEach(k => {
        row[k] = trim(orig_row[k]) // get rid of white-space and reduce all-blank cells to empty strings
    })

    var d = {
        media: {
            caption: row['Media Caption'] || '',
            credit: row['Media Credit'] || '',
            url: row['Media'] || '',
            thumbnail: row['Media Thumbnail'] || ''
        },
        text: {
            headline: row['Headline'] || '',
            text: row['Text'] || ''
        },
        display_date: row['Display Date'] || '', // only in v3 but no problem
        group: row['Group'] || row['Tag'] || '', // small diff between v1 and v3 sheets
        background: interpretBackground(row['Background']), // only in v3 but no problem
        type: row['Type'] || ''
    }

    if (Object.keys(row).includes('Start Date') || Object.keys(row).includes('End Date')) {
        // V1 date handling
        if (row['Start Date']) {
            d.start_date = parseDate(row['Start Date'])
        }
        if (row['End Date']) {
            d.end_date = parseDate(row['End Date'])
        }
    } else {
        // V3 date handling
        // every date must have at least a year to be valid.
        if (row['Year']) {
            d.start_date = {
                year: clean_integer(row['Year']),
                month: clean_integer(row['Month']) || '',
                day: clean_integer(row['Day']) || ''
            }
        }
        if (row['End Year']) {
            d.end_date = {
                year: clean_integer(row['End Year']) || '',
                month: clean_integer(row['End Month']) || '',
                day: clean_integer(row['End Day']) || ''
            }
        }

        if (row['Time']) {
            if (d.start_date) {
                mergeData(d.start_date, parseTime(row['Time']));
            } else {
                throw new TLError("invalid_start_time_without_date")
            }
        }

        if (row['End Time']) {
            if (d.end_date) {
                mergeData(d.end_date, parseTime(row['End Time']));
            } else {
                throw new TLError("invalid_end_time_without_date")
            }
        }

        if (d.start_date && !validDateConfig(d.start_date)) {
            throw new TLError("invalid_date_err")
        }

        if (d.end_date && !validDateConfig(d.end_date)) {
            throw new TLError("invalid_date_err")
        }


    }

    return d
}

/**
 * Given a Google Sheets URL (or mere document ID), read the data and return
 * a Timeline JSON file suitable for instantiating a timeline.
 * 
 * @param {string} url 
 */
export async function readGoogleAsCSV(url, sheets_proxy) {

    let rows = []

    url = makeGoogleCSVURL(url)
    let error = null;

    await fetchCSV({
        url: `${sheets_proxy}${url}`,
    }).then(d => {
        rows = d;
    }).catch(error_json => {
        if (error_json.proxy_err_code == 'response_not_csv') {
            throw new TLError('Timeline could not read the data for your timeline. Make sure you have published it to the web.')
        }
        throw new TLError(error_json.message)
    })

    let timeline_config = { 'events': [], 'errors': [], 'warnings': [], 'eras': [] }

    rows.forEach((row, i) => {
        try {
            if (!isEmptyObject(row)) {
                let event = extractEventFromCSVObject(row)
                handleRow(event, timeline_config)
            }
        } catch (e) {
            if (e.constructor == TLError) {
                timeline_config.errors.push(e);
            } else {
                if (e.message) {
                    e = e.message;
                }
                let label = row['Headline'] || i
                timeline_config.errors.push(e + `[${label}]`);
            }
        }
    });

    return timeline_config
}
/**
 * Given a Google Sheets URL or a bare spreadsheet key, return a URL expected
 * to retrieve a CSV file, assuming the Sheets doc has been "published to the web".
 * No checking for the actual availability is done.
 * @param {string} url_or_key 
 */
export function makeGoogleCSVURL(url_or_key) {
    url_or_key = url_or_key.trim()
    if (url_or_key.match(/^[a-zA-Z0-9-_]+$/)) {
        // key pattern from https://developers.google.com/sheets/api/guides/concepts#spreadsheet_id
        return `https://docs.google.com/spreadsheets/d/${url_or_key}/pub?output=csv`
    }

    if (url_or_key.startsWith('https://docs.google.com/spreadsheets/')) {
        if (url_or_key.match(/\/pub\?output=csv$/)) return url_or_key
        let parsed = new URL(url_or_key)
        let params = new URLSearchParams(parsed.search)
        params.set('output', 'csv')
        if (params.get('gid')) {
            params.set('single', 'true')
        }
        parsed.search = `?${params.toString()}`
        let base_path = parsed.pathname.substr(0, parsed.pathname.lastIndexOf('/'))
        parsed.pathname = `${base_path}/pub`
        return parsed.toString()
    }
    throw new TLError('invalid_url_err', url_or_key);
}

var buildGoogleFeedURL = function(key, api_version) {
    if (api_version == 'v4') {
        return "https://sheets.googleapis.com/v4/spreadsheets/" + key + "/values/A1:R1000?key=AIzaSyCInR0kjJJ2Co6aQAXjLBQ14CEHam3K0xg";
    } else {
        return "https://spreadsheets.google.com/feeds/list/" + key + "/1/public/values?alt=json";
    }
}

async function jsonFromGoogleURL(google_url, options) {

    if (!options['sheets_proxy']) {
        throw new TLError("Proxy option must be set to read data from Google")
    }

    var timeline_json = await readGoogleAsCSV(google_url, options['sheets_proxy']);

    if (timeline_json) {
        return timeline_json;
    }
}

/**
 * Using the given URL, fetch or create a JS Object suitable for configuring a timeline. Use 
 * that to create a TimelineConfig, and invoke the callback with that object as its argument. 
 * If the second argument is an object instead of a callback function, it must have a 
 * 'callback' property which will be invoked with the config.
 * Even in error cases, a minimal TimelineConfig object will be created and passed to the callback
 * so that error messages can be displayed in the host page.
 * 
 * @param {String} url the URL or Google Spreadsheet key which can be used to get configuration information
 * @param {function|object} callback_or_options either a callback function or an object with a 'callback' property and other configuration properties
 */
export async function makeConfig(url, callback_or_options) {

    let callback = null,
        options = {};
    if (typeof(callback_or_options) == 'function') {
        callback = callback_or_options
    } else if (typeof(callback_or_options) == 'object') {
        options = callback_or_options
        callback = callback_or_options['callback']
        if (typeof(options['callback']) == 'function') callback = options['callback']
    }

    if (!callback) {
        throw new TLError("Second argument to makeConfig must be either a function or an object which includes a 'callback' property with a 'function' type value")
    }

    var tc,
        json,
        key = parseGoogleSpreadsheetURL(url);

    if (key) {
        try {
            json = await jsonFromGoogleURL(url, options);
        } catch (e) {
            // even with an error, we make 
            // a TimelineConfig because it's 
            // the most straightforward way to display messages
            // in the DOM
            tc = new TimelineConfig();
            if (e.name == 'NetworkError') {
                tc.logError(new TLError("network_err"));
            } else if (e.name == 'TLError') {
                tc.logError(e);
            } else {
                tc.logError(new TLError("unknown_read_err", e.name));
            }
            callback(tc);
            return; // don't process further if there were errors
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
            success: function(data) {
                try {
                    tc = new TimelineConfig(data);
                } catch (e) {
                    tc = new TimelineConfig();
                    tc.logError(e);
                }
                callback(tc);
            },
            error: function(xhr, errorType, error) {
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

function handleRow(event, timeline_config) {
    var row_type = 'event';
    if (typeof(event.type) != 'undefined') {
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