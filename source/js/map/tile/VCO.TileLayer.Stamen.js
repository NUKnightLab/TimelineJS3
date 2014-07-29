/*	VCO.TyleLayer.Stamen
	Makes Stamen Map tiles available
	http://maps.stamen.com/
================================================== */

(function(exports) {

	/*	tile.stamen.js v1.2.3
	================================================== */
	var SUBDOMAINS = "a b c d".split(" "),
		MAKE_PROVIDER = function(layer, type, minZoom, maxZoom) {
			return {
				"url":          ["http://stamen-tiles-{S}.a.ssl.fastly.net/", layer, "/{Z}/{X}/{Y}.", type].join(""),
				"type":         type,
				"subdomains":   SUBDOMAINS.slice(),
				"minZoom":      minZoom,
	            "maxZoom":      maxZoom,
	            "attribution":  [
					"<a href='http://leafletjs.com' title='A JS library for interactive maps'>Leaflet</a> | ",
	                'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ',
	                'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
	                'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ',
	                'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
	            ].join("")
	        };
	    },
	    PROVIDERS =  {
	        "toner":        MAKE_PROVIDER("toner", "png", 0, 20),
	        "terrain":      MAKE_PROVIDER("terrain", "jpg", 4, 18),
	        "watercolor":   MAKE_PROVIDER("watercolor", "jpg", 1, 16),
	        "trees-cabs-crime": {
	            "url": "http://{S}.tiles.mapbox.com/v3/stamen.trees-cabs-crime/{Z}/{X}/{Y}.png",
	            "type": "png",
	            "subdomains": "a b c d".split(" "),
	            "minZoom": 11,
	            "maxZoom": 18,
	            "extent": [
	                {"lat": 37.853, "lon": -122.577},
	                {"lat": 37.684, "lon": -122.313}
	            ],
	            "attribution": [
	                'Design by Shawn Allen at <a href="http://stamen.com">Stamen</a>.',
	                'Data courtesy of <a href="http://fuf.net">FuF</a>,',
	                '<a href="http://www.yellowcabsf.com">Yellow Cab</a>',
	                '&amp; <a href="http://sf-police.org">SFPD</a>.'
	            ].join(" ")
	        }
	    };

	// set up toner and terrain flavors
	setupFlavors("toner", ["hybrid", "labels", "lines", "background", "lite"]);
	// toner 2010
	setupFlavors("toner", ["2010"]);
	// toner 2011 flavors
	setupFlavors("toner", ["2011", "2011-lines", "2011-labels", "2011-lite"]);
	setupFlavors("terrain", ["background"]);
	setupFlavors("terrain", ["labels", "lines"], "png");


	/*	Export stamen.tile to the provided namespace.
	================================================== */
	exports.stamen = exports.stamen || {};
	exports.stamen.tile = exports.stamen.tile || {};
	exports.stamen.tile.providers = PROVIDERS;
	exports.stamen.tile.getProvider = getProvider;


	/*	A shortcut for specifying "flavors" of a style, which are assumed to have the
		same type and zoom range.
	================================================== */
	function setupFlavors(base, flavors, type) {
	    var provider = getProvider(base);
	    for (var i = 0; i < flavors.length; i++) {
	        var flavor = [base, flavors[i]].join("-");
	        PROVIDERS[flavor] = MAKE_PROVIDER(flavor, type || provider.type, provider.minZoom, provider.maxZoom);
	    }
	}

	/*	Get the named provider, or throw an exception 
		if it doesn't exist.
	================================================== */
	function getProvider(name) {
	    if (name in PROVIDERS) {
	        return PROVIDERS[name];
	    } else {
	        throw 'No such provider (' + name + ')';
	    }
	}

	/*	StamenTileLayer for modestmaps-js
		<https://github.com/modestmaps/modestmaps-js/>
		Works with both 1.x and 2.x by checking for the existence of MM.Template.
	================================================== */
	if (typeof MM === "object") {
	    var ModestTemplate = (typeof MM.Template === "function")
	        ? MM.Template
	        : MM.TemplatedMapProvider;
	    MM.StamenTileLayer = function(name) {
	        var provider = getProvider(name);
	        this._provider = provider;
	        MM.Layer.call(this, new ModestTemplate(provider.url, provider.subdomains));
	        this.provider.setZoomRange(provider.minZoom, provider.maxZoom);
	        this.attribution = provider.attribution;
	    };

	    MM.StamenTileLayer.prototype = {
	        setCoordLimits: function(map) {
	            var provider = this._provider;
	            if (provider.extent) {
	                map.coordLimits = [
	                    map.locationCoordinate(provider.extent[0]).zoomTo(provider.minZoom),
	                    map.locationCoordinate(provider.extent[1]).zoomTo(provider.maxZoom)
	                ];
	                return true;
	            } else {
	                return false;
	            }
	        }
	    };

	    MM.extend(MM.StamenTileLayer, MM.Layer);
	}

	/*	StamenTileLayer for Leaflet
		<http://leaflet.cloudmade.com/>
		Tested with version 0.3 and 0.4, but should work on all 0.x releases.
	================================================== */
	if (typeof L === "object") {
	    L.StamenTileLayer = L.TileLayer.extend({
	        initialize: function(name, options) {
	            var provider = getProvider(name),
	                url = provider.url.replace(/({[A-Z]})/g, function(s) {
	                    return s.toLowerCase();
	                }), 
					_options = {
						minZoom: 		provider.minZoom,
						maxZoom: 		provider.maxZoom,
						subdomains: 	provider.subdomains,
						scheme: 		"xyz",
						attribution: 	provider.attribution
					};
					
				if (options) {
					VCO.Util.mergeData(_options, options);
				}
				
	            L.TileLayer.prototype.initialize.call(this, url, _options);
	        }
	    });
	}

	/*	 StamenMapType for Google Maps API V3
		<https://developers.google.com/maps/documentation/javascript/>
	================================================== */
	if (typeof google === "object" && typeof google.maps === "object") {
	    google.maps.StamenMapType = function(name) {
	        var provider = getProvider(name),
	            subdomains = provider.subdomains;
	        return google.maps.ImageMapType.call(this, {
	            "getTileUrl": function(coord, zoom) {
	                var numTiles = 1 << zoom,
	                    wx = coord.x % numTiles,
	                    x = (wx < 0) ? wx + numTiles : wx,
	                    y = coord.y,
	                    index = (zoom + x + y) % subdomains.length;
	                return provider.url
	                    .replace("{S}", subdomains[index])
	                    .replace("{Z}", zoom)
	                    .replace("{X}", x)
	                    .replace("{Y}", y);
	            },
	            "tileSize": new google.maps.Size(256, 256),
	            "name":     name,
	            "minZoom":  provider.minZoom,
	            "maxZoom":  provider.maxZoom
	        });
	    };
	    // FIXME: is there a better way to extend classes in Google land?
	    google.maps.StamenMapType.prototype = new google.maps.ImageMapType("_");
	}

})(typeof exports === "undefined" ? this : exports);
