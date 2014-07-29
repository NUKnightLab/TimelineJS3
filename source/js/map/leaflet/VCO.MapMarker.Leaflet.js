/*	VCO.MapMarker.Leaflet
	Produces a marker for Leaflet Maps
================================================== */

VCO.MapMarker.Leaflet = VCO.MapMarker.extend({
	
	
	/*	Create Marker
	================================================== */
	_createMarker: function(d, o) {
		
		var icon = {}; //new L.Icon.Default();
		
		if (d.location && d.location.lat && d.location.lon) {
			this.data.real_marker = true;
			if (o.use_custom_markers && d.location.icon && d.location.icon != "") {
				this._custom_icon = true;
				this._custom_icon_url = d.location.icon;
				this._icon = new L.icon({iconUrl: this._custom_icon_url, iconSize: [48], iconAnchor:[24, 48]});
			
			} else if (o.use_custom_markers && d.location.image && d.location.image != "") {
				this._custom_image_icon = true;
				this._custom_icon_url = d.location.image;
				this._icon = new L.icon({iconUrl: this._custom_icon_url, iconSize: [48], iconAnchor:[24, 48], shadowSize: [68, 95], shadowAnchor: [22, 94], className:"vco-mapmarker-image-icon"});
			} else {
				this._icon = new L.divIcon({className: 'vco-mapmarker ' + this.media_icon_class, iconAnchor:[10, 10]});
			}
			
			this._marker = new L.marker([d.location.lat, d.location.lon], {
				title: 		d.text.headline,
				icon: 		this._icon
			});
		
			this._marker.on("click", this._onMarkerClick, this); 
			
			if (o.map_popup) {
				this._createPopup(d, o);
			}
		}
	},
	
	_addTo: function(m) {
		if (this.data.real_marker) {
			this._marker.addTo(m);
		}
	},
	
	_createPopup: function(d, o) {
		/*
		var html = "";
		html += "<h4>" + this.data.text.headline + "</h4>";
		this._marker.bindPopup(html, {closeButton:false, offset:[0, 43]});
		*/
	},
	
	_active: function(a) {
		var self = this;
		
		if (this.data.media && this.data.media.mediatype) {
			this.media_icon_class = "vco-mapmarker-icon vco-icon-" + this.data.media.mediatype.type;
		} else {
			this.media_icon_class = "vco-mapmarker-icon vco-icon-plaintext";
		}
		
		if (this.data.real_marker) {
			if (a) {
				this._marker.setZIndexOffset(100);
				if (this._custom_image_icon) {
					this._icon = new L.icon({iconUrl: this._custom_icon_url, iconSize: [48], iconAnchor:[24, 48], shadowSize: [68, 95], shadowAnchor: [22, 94], className:"vco-mapmarker-image-icon-active"});
				} else {
					this._icon = new L.divIcon({className: 'vco-mapmarker-active ' + this.media_icon_class, iconAnchor:[10, 10]});
				}
				
				//this.timer = setTimeout(function() {self._openPopup();}, this.options.duration + 200);
				this._setIcon();
			} else {
				//this._marker.closePopup();
				clearTimeout(this.timer);
				this._marker.setZIndexOffset(0);
				if (this._custom_image_icon) {
					this._icon = new L.icon({iconUrl: this._custom_icon_url, iconSize: [48], iconAnchor:[24, 48], shadowSize: [68, 95], shadowAnchor: [22, 94], className:"vco-mapmarker-image-icon"});
				} else {
					this._icon = new L.divIcon({className: 'vco-mapmarker ' + this.media_icon_class, iconAnchor:[10, 10]});
				}
				
				this._setIcon();
			}
		}
	},
	
	_openPopup: function() {
		this._marker.openPopup();
	},
	
	_setIcon: function() {
		this._marker.setIcon(this._icon);
	},
	
	_location: function() {
		if (this.data.real_marker) {
			return this._marker.getLatLng();
		} else {
			return {};
		}
	}
	
});
