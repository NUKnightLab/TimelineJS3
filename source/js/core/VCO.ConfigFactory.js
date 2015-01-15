/* VCO.ConfigFactory.js
 * Build TimelineConfig objects from other data sources
 */
;(function(VCO){
    function extractSpreadsheetKey(url) {
        var pat = /\bkey=([_A-Za-z0-9]+)&?/i;
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

    function extractGoogleEntryData(item) {
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

    VCO.ConfigFactory = {
        fromGoogle: function(url) {
            var key = extractSpreadsheetKey(url);
            // TODO: maybe get specific worksheets?
            var worksheet = '1';
            url = "https://spreadsheets.google.com/feeds/list/" + key + "/" + worksheet + "/public/values?alt=json";
            var data = VCO.ajax({
                url: url, 
                async: false
            });
            var events = [];
            data = JSON.parse(data.responseText);
            window.google_data = data;
            for (var i = 0; i < data.feed.entry.length; i++) {
                events.push(extractGoogleEntryData(data.feed.entry[i]));
            };
            return {scale: 'javascript', events: events}
        }   
    }
})(VCO)
