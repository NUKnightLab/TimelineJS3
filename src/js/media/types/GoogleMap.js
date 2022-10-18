import { Media } from "../Media";
import { ratio, getParamString } from "../../core/Util"


export default class GoogleMap extends Media {

    /*  Load the media
    ================================================== */
    _loadMedia() {

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-map tl-media-shadow", this._el.content);

        // Get Media ID
        this.media_id = this.data.url;

        // API Call
        this.mapframe = this.domCreate("iframe", "", this._el.content_item);
        this.mapframe.width = "100%";
        this.mapframe.height = "100%";
        this.mapframe.frameBorder = "0";
        this.mapframe.src = this.makeGoogleMapsEmbedURL(this.media_id, this.options.api_key_googlemaps);


        // After Loaded
        this.onLoaded();
    }

    _updateMediaDisplay() {
        if (this._state.loaded) {
            var dimensions = ratio.square({ w: this._el.content_item.offsetWidth });
            this._el.content_item.style.height = dimensions.h + "px";
        }
    }

    makeGoogleMapsEmbedURL(url, api_key) {
        // Test with https://docs.google.com/spreadsheets/d/1zCpvtRdftlR5fBPppmy_-SkGIo7RMwoPUiGFZDAXbTc/edit
        var Streetview = false;

        function determineMapMode(url) {
            function parseDisplayMode(display_mode, param_string) {
                // Set the zoom param
                if (display_mode.slice(-1) == "z") {
                    param_string["zoom"] = display_mode;
                    // Set the maptype to something other than "roadmap"
                } else if (display_mode.slice(-1) == "m") {
                    // TODO: make this somehow interpret the correct zoom level
                    // until then fake it by using Google's default zoom level
                    param_string["zoom"] = 14;
                    param_string["maptype"] = "satellite";
                    // Set all the fun streetview params
                } else if (display_mode.slice(-1) == "t") {
                    Streetview = true;
                    // streetview uses "location" instead of "center"
                    // "place" mode doesn't have the center param, so we may need to grab that now
                    if (mapmode == "place") {
                        var center = url.match(regexes["place"])[3] + "," + url.match(regexes["place"])[4];
                    } else {
                        var center = param_string["center"];
                        delete param_string["center"];
                    }
                    // Clear out all the other params -- this is so hacky
                    param_string = {};
                    param_string["location"] = center;
                    streetview_params = display_mode.split(",");
                    for (let param in param_defs["streetview"]) {
                        var i = parseInt(param) + 1;
                        if (param_defs["streetview"][param] == "pitch" && streetview_params[i] == "90t") {
                            // Although 90deg is the horizontal default in the URL, 0 is horizontal default for embed URL. WHY??
                            // https://developers.google.com/maps/documentation/javascript/streetview
                            param_string[param_defs["streetview"][param]] = 0;
                        } else {
                            param_string[param_defs["streetview"][param]] = streetview_params[i].slice(0, -1);
                        }
                    }

                }
                return param_string;
            }

            function determineMapModeURL(mapmode, match) {
                var param_string = {};
                var url_root = match[1],
                    display_mode = match[match.length - 1];
                for (let param in param_defs[mapmode]) {
                    // skip first 2 matches, because they reflect the URL and not params
                    var i = parseInt(param) + 2;
                    if (param_defs[mapmode][param] == "center") {
                        param_string[param_defs[mapmode][param]] = match[i] + "," + match[++i];
                    } else {
                        param_string[param_defs[mapmode][param]] = match[i];
                    }
                }

                param_string = parseDisplayMode(display_mode, param_string);
                param_string["key"] = api_key;
                if (Streetview == true) {
                    mapmode = "streetview";
                } else {}
                return (url_root + "/embed/v1/" + mapmode + getParamString(param_string));
            }


            let mapmode = "view";
            if (url.match(regexes["place"])) {
                mapmode = "place";
            } else if (url.match(regexes["directions"])) {
                mapmode = "directions";
            } else if (url.match(regexes["search"])) {
                mapmode = "search";
            }
            return determineMapModeURL(mapmode, url.match(regexes[mapmode]));

        }

        // These must be in the order they appear in the original URL
        // "key" param not included since it's not in the URL structure
        // Streetview "location" param not included since it's captured as "center"
        // Place "center" param ...um...
        var param_defs = {
            "view": ["center"],
            "place": ["q", "center"],
            "directions": ["origin", "destination", "center"],
            "search": ["q", "center"],
            "streetview": ["fov", "heading", "pitch"]
        };
        // Set up regex parts to make updating these easier if Google changes them
        var root_url_regex = /(https:\/\/.+google.+?\/maps)/;
        var coords_regex = /@([-\d.]+),([-\d.]+)/;
        var address_regex = /([\w\W]+)/;

        // Data doesn't seem to get used for anything
        var data_regex = /data=[\S]*/;

        // Capture the parameters that determine what map tiles to use
        // In roadmap view, mode URLs include zoom paramater (e.g. "14z")
        // In satellite (or "earth") view, URLs include a distance parameter (e.g. "84511m")
        // In streetview, URLs include paramaters like "3a,75y,49.76h,90t" -- see http://stackoverflow.com/a/22988073
        var display_mode_regex = /,((?:[-\d.]+[zmayht],?)*)/;

        var regexes = {
            view: new RegExp(root_url_regex.source + "/" + coords_regex.source + display_mode_regex.source),
            place: new RegExp(root_url_regex.source + "/place/" + address_regex.source + "/" + coords_regex.source + display_mode_regex.source),
            directions: new RegExp(root_url_regex.source + "/dir/" + address_regex.source + "/" + address_regex.source + "/" + coords_regex.source + display_mode_regex.source),
            search: new RegExp(root_url_regex.source + "/search/" + address_regex.source + "/" + coords_regex.source + display_mode_regex.source)
        };
        return determineMapMode(url);
    }

}