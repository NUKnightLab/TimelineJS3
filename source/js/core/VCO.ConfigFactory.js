/* VCO.ConfigFactory.js
 * Build TimelineConfig objects from other data sources
 */
;(function(VCO){
    function extractSpreadsheetKey(url) {
        var pat = /\bkey=([-_A-Za-z0-9]+)&?/i;
        if (url.match(pat)) {
            return url.match(pat)[1];
        }
        var key = null;
        if (url.match("docs.google.com/spreadsheets/d/")) {
            var pos = url.indexOf("docs.google.com/spreadsheets/d/") + "docs.google.com/spreadsheets/d/".length;
            var tail = url.substr(pos);
            key = tail.split('/')[0]
        }
        if (!key) { key = url}
        return key;
    }

    function extractGoogleEntryData_V1(item) {
        var item_data = {}
        for (k in item) {
            if (k.indexOf('gsx$') == 0) {
                item_data[k.substr(4)] = item[k].$t;
            }
        }
        if (!item_data.startdate) {
            throw("All items must have a start date column.")
        }
        var d = {
            media: {
                caption: item_data.mediacaption || '',
                credit: item_data.mediacredit || '',
                url: item_data.media || '',
                thumb: ''
            },
            text: {
                headline: item_data.headline || '',
                text: item_data.text || ''
            }
        }
        d['start_date'] = VCO.Date.parseDate(item_data.startdate);
        if (item.enddate) {
            d['end_date'] = VCO.Date.parseDate(item.enddate);
        }
        return d;
    }

    function extractGoogleEntryData_V3(item) {
        var item_data = {}
        for (k in item) {
            if (k.indexOf('gsx$') == 0) {
                item_data[k.substr(4)] = item[k].$t;
            }
        }
        var d = {
            media: {
                caption: item_data.mediacaption || '',
                credit: item_data.mediacredit || '',
                url: item_data.media || '',
                thumb: item_data.mediathumbnail || ''
            },
            text: {
                headline: item_data.headline || '',
                text: item_data.text || ''
            },
            start_date: {
                year: item_data.year,
                month: item_data.month || '',
                day: item_data.day || '',
                time: item_data.time || ''
            },
            end_date: {
                year: item_data.endyear || '',
                month: item_data.endmonth || '',
                day: item_data.endday || '',
                time: item_data.endtime || ''
            },
            display_date: item_data.displaydate || '',

            type: item_data.type || ''
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

        return d;
    }

    var getGoogleItemExtractor = function(data) {
        if (typeof data.feed.entry === 'undefined' 
                || data.feed.entry.length == 0) {
            throw('No data entries found.');
        }
        var entry = data.feed.entry[0];
        if (typeof entry.gsx$startdate !== 'undefined') {
            return extractGoogleEntryData_V1;
        } else if (typeof entry.gsx$year !== 'undefined') {
            return extractGoogleEntryData_V3;
        } else {
            throw('Invalid data format.');
        }
    }

    VCO.ConfigFactory = {

        extractSpreadsheetKey: extractSpreadsheetKey,

        fromGoogle: function(url) {
            var key = extractSpreadsheetKey(url);
            // TODO: maybe get specific worksheets?
            var worksheet = '1';
            url = "https://spreadsheets.google.com/feeds/list/" + key + "/" + worksheet + "/public/values?alt=json";
            return this.fromFeed(url);
        },

        fromFeed: function(url) {
            var timeline_config = { 'events': [] };
            var data = VCO.ajax({
                url: url, 
                async: false
            });
            data = JSON.parse(data.responseText);
            window.google_data = data;
            var extract = getGoogleItemExtractor(data);
            for (var i = 0; i < data.feed.entry.length; i++) {
                var event = extract(data.feed.entry[i]);
                var row_type = 'event';
                if (typeof(event.type) != 'undefined') {
                    row_type = event.type;
                    delete event.type;
                }
                if (row_type == 'title') {
                    timeline_config.title = event;
                } else {
                    timeline_config.events.push(event);
                }
            };
            return timeline_config;
        }
    }
})(VCO)
