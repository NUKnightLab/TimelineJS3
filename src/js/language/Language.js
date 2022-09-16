import { mergeData, pad, trace } from "../core/Util"
import { fetchJSON } from "../net/Net"
import { BigYear } from "../date/TLDate"
import TLError from "../core/TLError";

const MESSAGE_VARIABLE_PATTERN = new RegExp(/\$\{(.+?)\}/g)
    /**
     * Instantiate a Language object to manage I18N. 
     * WARNING: In general, this should not be called directly, because it doesn't block while
     * the language file is loaded, which can lead to race conditions in some cases. In most
     * cases, language objects other than the fallback should be gotten by calling the 
     * async function loadLanguage defined elsewhere in this file.
     * 
     * @param {String} [language=en] - a language code or a URL to a 
     *     translation file
     * @param {string} [script_path] - if `language` is not a URL, this is used
     *     to construct a fully-qualified URL to load a translation file.
     */
class Language {
    constructor(language, script_path) {
        // borrowed from http://stackoverflow.com/a/14446414/102476
        for (let k in LANGUAGES.en) {
            this[k] = LANGUAGES.en[k];
        }
        // `language` won't be defined when the fallback is constructed
        if (language && typeof(language) == 'string' && language != 'en') {
            var code = language;
            if (!(code in LANGUAGES)) {
                console.log(`Expected language ${code} to be cached. Did you call the constructor directly?`)
                var url = buildLanguageURL(code, script_path);
                fetchJSON(url).then((json) => {
                    LANGUAGES[code] = json
                }).catch(resp => {
                    console.log(`Error loading language [${url}] ${resp.statusText} [${resp.status}]`)
                })
            }
            mergeData(this, LANGUAGES[code]);
        }
    }

    /**
     * Reimplement Util.mergeData to handle nested dictionaries
     * @param {object} lang_json 
     */
    mergeData(lang_json) {
        for (k in LANGUAGES.en) {
            if (lang_json[k]) {
                if (typeof(this[k]) == 'object') {
                    mergeData(lang_json[k], this[k]);
                } else {
                    this[k] = lang_json[k]; // strings, mostly
                }
            }
        }
    }

    formatBigYear(bigyear, format_name) {
        var the_year = bigyear.year;
        var format_list = this.bigdateformats[format_name] || this.bigdateformats['fallback'];

        if (format_list) {
            for (var i = 0; i < format_list.length; i++) {
                var tuple = format_list[i];
                if (Math.abs(the_year / tuple[0]) > 1) {
                    // will we ever deal with distant future dates?
                    return formatNumber(Math.abs(the_year / tuple[0]), tuple[1])
                }
            };

            return the_year.toString();

        } else {
            trace("Language file dateformats missing cosmological. Falling back.");
            return formatNumber(the_year, format_name);
        }
    }

    /**
     * Look up a localized version of a standard message. While using `_` for the
     * method name is not exactly idiomatic javascript, it was inspired by Python's
     * {@link https://docs.python.org/3/library/gettext.html|gettext} module, with
     * the intention of reducing clutter in places where, in a non-I18N'd app, you'd 
     * simply have a quoted string.
     * 
     * @param {string} k - a message key 
     * @param {Object} [context] - a dictionary with string keys appropriate to message `k` 
     *      and string values which will be interpolated into the message.
     * @returns {string} - a localized string appropriate to the message key
     */
    _(k, context) {
        let msg = this.messages[k] || Language.fallback.messages[k] || k;
        if (msg.match(MESSAGE_VARIABLE_PATTERN)) {
            if (!context) throw new TLError("template_message_without_context")
            for (let match of msg.matchAll(MESSAGE_VARIABLE_PATTERN)) {
                if (!(match[1] in context)) throw new TLError("template_message_without_context")
                msg = msg.replace(match[0], context[match[1]])
            }
        }
        return msg
    }

    formatDate(date, format_name) {

        if (date.constructor == Date) {
            return this.formatJSDate(date, format_name);
        }

        if (date.constructor == BigYear) {
            return this.formatBigYear(date, format_name);
        }

        if (date.data && date.data.date_obj) {
            return this.formatDate(date.data.date_obj, format_name);
        }

        trace("Unfamiliar date presented for formatting");
        return date.toString();
    }



    formatJSDate(js_date, format_name) {
        // ultimately we probably want this to work with TLDate instead of (in addition to?) JS Date
        // utc, timezone and timezoneClip are carry over from Steven Levithan implementation. We probably aren't going to use them.
        var self = this;
        var formatPeriod = function(fmt, value) {
            var formats = self.period_labels[fmt];
            if (formats) {
                var fmt = (value < 12) ? formats[0] : formats[1];
            }
            return "<span class='tl-timeaxis-timesuffix'>" + fmt + "</span>";
        }

        var utc = false,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g;


        if (!format_name) {
            format_name = 'full';
        }

        var mask = this.dateformats[format_name] || Language.fallback.dateformats[format_name];
        if (!mask) {
            mask = format_name; // allow custom format strings
        }


        var _ = utc ? "getUTC" : "get",
            d = js_date[_ + "Date"](),
            D = js_date[_ + "Day"](),
            m = js_date[_ + "Month"](),
            y = js_date[_ + "FullYear"](),
            H = js_date[_ + "Hours"](),
            M = js_date[_ + "Minutes"](),
            s = js_date[_ + "Seconds"](),
            L = js_date[_ + "Milliseconds"](),
            o = utc ? 0 : js_date.getTimezoneOffset(),
            year = "",
            flags = {
                d: d,
                dd: pad(d),
                ddd: this.date.day_abbr[D],
                dddd: this.date.day[D],
                m: m + 1,
                mm: pad(m + 1),
                mmm: this.date.month_abbr[m],
                mmmm: this.date.month[m],
                yy: String(y).slice(2),
                yyyy: (y < 0 && this.has_negative_year_modifier()) ? Math.abs(y) : y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: formatPeriod('t', H),
                tt: formatPeriod('tt', H),
                T: formatPeriod('T', H),
                TT: formatPeriod('TT', H),
                Z: utc ? "UTC" : (String(js_date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        var formatted = mask.replace(Language.DATE_FORMAT_TOKENS, function($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });

        return this._applyEra(formatted, y);
    }

    has_negative_year_modifier() {
        return Boolean(this.era_labels.negative_year.prefix || this.era_labels.negative_year.suffix);
    }


    _applyEra(formatted_date, original_year) {
        // trusts that the formatted_date was property created with a non-negative year if there are
        // negative affixes to be applied
        var labels = (original_year < 0) ? this.era_labels.negative_year : this.era_labels.positive_year;
        var result = '';
        if (labels.prefix) { result += '<span>' + labels.prefix + '</span> ' }
        result += formatted_date;
        if (labels.suffix) { result += ' <span>' + labels.suffix + '</span>' }
        return result;
    }


}

/**
 * Provide an async factory method for loading languages that clarifies the need to wait 
 * for the language data to be loaded, so that other code doesn't press ahead before the language
 * is available. 
 * 
 * 
 * @param {String} language_code - a language code or a fully-qualified URL to a language JSON file
 * @param {String} script_path - a URL prefix which can be used to construct a fully-qualified URL to a language file using `language_code`
 * 
 * @returns {Language} - an instance of Language, or null if there's an error loading the translation file
 */
async function loadLanguage(language_code, script_path) {
    var url = buildLanguageURL(language_code, script_path);
    try {
        if (!LANGUAGES[language_code]) {
            let json = await fetchJSON(url)
            LANGUAGES[language_code] = json
        }
        return new Language(language_code, script_path)
    } catch (e) {
        console.log(`Error loading language [${url}] ${e.statusText}`)
        return null;
    }

}

function buildLanguageURL(code, script_path) {
    if (/\.json$/.test(code)) {
        var url = code;
    } else {
        var fragment = "/locale/" + code + ".json";
        if (/\/$/.test(script_path)) { fragment = fragment.substr(1); }
        var url = script_path + fragment;
    }
    return url;
}

function formatNumber(val, mask) {
    if (mask.match(/%(\.(\d+))?f/)) {
        var match = mask.match(/%(\.(\d+))?f/);
        var token = match[0];
        if (match[2]) {
            val = val.toFixed(match[2]);
        }
        return mask.replace(token, val);
    }
    // use mask as literal display value.
    return mask;
}




Language.fallback = { messages: {} }; // placeholder to satisfy IE8 early compilation


Language.DATE_FORMAT_TOKENS = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;

var LANGUAGES = {
    /*
	This represents the canonical list of message keys which translation files should handle. The existence of the 'en.json' file should not mislead you.
	It is provided more as a starting point for someone who wants to provide a
    new translation since the form for non-default languages (JSON not JS) is slightly different 
    from what appears below. Also, those files have some message keys grandfathered in from TimelineJS2 
    which we'd rather not have to get "re-translated" if we use them.
*/
    en: {
        name: "English (built-in)",
        lang: "en",
        api: {
            wikipedia: "en" // the two letter code at the beginning of the Wikipedia subdomain for this language
        },
        messages: {
            loading: "Loading",
            wikipedia: "From Wikipedia, the free encyclopedia",
            error: "Error",
            return_to_title: "Return to Title",
            go_to_end: "Go to the last slide",
            loading_content: "Loading Content",
            loading_timeline: "Loading Timeline... ",
            swipe_to_navigate: "Swipe to Navigate<br><span class='tl-button'>OK</span>",
            zoom_in: "Zoom in",
            zoom_out: "Zoom out",
            unknown_read_err: "An unexpected error occurred trying to read your spreadsheet data",
            invalid_url_err: "Unable to read Timeline data. Make sure your URL is for a Google Spreadsheet or a Timeline JSON file.",
            network_err: "Unable to read your Google Spreadsheet. Make sure you have published it to the web.",
            missing_start_date_err: "Missing start_date",
            invalid_start_time_without_date: "Invalid configuration: time cannot be used without date.",
            invalid_end_time_without_date: "Invalid configuration: end time cannot be used without end date.",
            date_compare_err: "Can't compare timeline date objects on different scales",
            invalid_scale_err: "Invalid scale",
            invalid_date_err: "Invalid date: month, day and year must be numbers.",
            invalid_separator_error: "Invalid time: misuse of : or . as separator.",
            invalid_hour_err: "Invalid time (hour)",
            invalid_minute_err: "Invalid time (minute)",
            invalid_second_err: "Invalid time (second)",
            invalid_fractional_err: "Invalid time (fractional seconds)",
            invalid_second_fractional_err: "Invalid time (seconds and fractional seconds)",
            invalid_year_err: "Invalid year",
            flickr_notfound_err: "Photo not found or private",
            flickr_invalidurl_err: "Invalid Flickr URL",
            imgur_invalidurl_err: "Invalid Imgur URL",
            twitter_load_err: "Unable to load Tweet",
            twitterembed_invalidurl_err: "Invalid Twitter Embed url",
            wikipedia_load_err: "Unable to load Wikipedia entry",
            spotify_invalid_url: "Invalid Spotify URL",
            invalid_rgb_err: "Invalid RGB argument",
            time_scale_scale_err: "Don't know how to get date from time for scale",
            axis_helper_no_options_err: "Axis helper must be configured with options",
            axis_helper_scale_err: "No AxisHelper available for scale",
            invalid_integer_option: "Invalid option value—must be a whole number.",
            instagram_bad_request: "Invalid or private Instagram URL",
            template_message_without_context: "Required variables not provided for template translation message",
            aria_label_timeline: "Timeline",
            aria_label_timeline_navigation: "Timeline navigation",
            aria_label_timeline_content: "Timeline content",
            // The following message keys are pseudo-template literal. 
            // Do not surround with backticks (`) since evaluation is deferred 
            // (and backticks wouldn't be allowed in JSON localization files)
            // for each, document typical values for variable components
            aria_label_zoomin: "Show less than ${start} to ${end}", // 'start' and 'end' should be numeric years 
            aria_label_zoomout: "Show more than ${start} to ${end}" // 'start' and 'end' should be numeric years 
        },
        date: {
            month: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
            month_abbr: [
                "Jan.",
                "Feb.",
                "March",
                "April",
                "May",
                "June",
                "July",
                "Aug.",
                "Sept.",
                "Oct.",
                "Nov.",
                "Dec."
            ],
            day: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            day_abbr: [
                "Sun.",
                "Mon.",
                "Tues.",
                "Wed.",
                "Thurs.",
                "Fri.",
                "Sat."
            ]
        },
        era_labels: {
            // specify prefix or suffix to apply to formatted date. Blanks mean no change.
            positive_year: {
                prefix: "",
                suffix: ""
            },
            negative_year: {
                // if either of these is specified, the year will be converted to positive before they are applied
                prefix: "",
                suffix: "BCE"
            }
        },
        period_labels: {
            // use of t/tt/T/TT legacy of original Timeline date format
            t: ["a", "p"],
            tt: ["am", "pm"],
            T: ["A", "P"],
            TT: ["AM", "PM"]
        },
        dateformats: {
            year: "yyyy",
            month_short: "mmm",
            month: "mmmm yyyy",
            full_short: "mmm d",
            full: "mmmm d',' yyyy",
            time: "h:MM:ss TT' <small>'mmmm d',' yyyy'</small>'",
            time_short: "h:MM:ss TT",
            time_no_seconds_short: "h:MM TT",
            time_no_minutes_short: "h TT",
            time_no_seconds_small_date: "h:MM TT' <small>'mmmm d',' yyyy'</small>'",
            time_milliseconds: "l",
            full_long: "mmm d',' yyyy 'at' h:MM TT",
            full_long_small_date: "h:MM TT' <small>mmm d',' yyyy'</small>'"
        },
        bigdateformats: {
            fallback: [
                // a list of tuples, with t[0] an order of magnitude and t[1] a format string. format string syntax may change...
                [1000000000, "%.2f billion years ago"],
                [1000000, "%.1f million years ago"],
                [1000, "%.1f thousand years ago"],
                [1, "%f years ago"]
            ],
            compact: [
                [1000000000, "%.2f bya"],
                [1000000, "%.1f mya"],
                [1000, "%.1f kya"],
                [1, "%f years ago"]
            ],
            verbose: [
                [1000000000, "%.2f billion years ago"],
                [1000000, "%.1f million years ago"],
                [1000, "%.1f thousand years ago"],
                [1, "%f years ago"]
            ]
        }
    }
};

let fallback = new Language();
Language.fallback = fallback;
export { Language, fallback, loadLanguage }