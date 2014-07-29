/*
 * L.TileLayer.Zoomify display Zoomify tiles with Leaflet
 * Modified from https://github.com/turban/Leaflet.Zoomify
 */

L.TileLayer.Zoomify = L.TileLayer.extend({
	options: {
		continuousWorld: true,
		tolerance: 0.8
	},

	initialize: function (url, options) {
		options = L.setOptions(this, options);
		this._url = url;

    	var imageSize = L.point(options.width, options.height),
	    	tileSize = options.tileSize;

    	this._imageSize = [imageSize];
    	this._gridSize = [this._getGridSize(imageSize)];

        while (imageSize.x > tileSize || imageSize.y > tileSize) {
        	imageSize = imageSize.divideBy(2).floor();
        	this._imageSize.push(imageSize);
        	this._gridSize.push(this._getGridSize(imageSize));
        }

		this._imageSize.reverse();
		this._gridSize.reverse();

        this.options.maxZoom = this._gridSize.length - 1;
	},

	onAdd: function (map) {
		L.TileLayer.prototype.onAdd.call(this, map);

		var mapSize = map.getSize(),
			zoom = this._getBestFitZoom(mapSize),
			imageSize = this._imageSize[zoom],
			center = map.options.crs.pointToLatLng(L.point(imageSize.x / 2, imageSize.y / 2), zoom);

		//map.setView(center, zoom, true);
	},
	
	getZoomifyBounds: function(map) {
		//return "getZoomifyBounds";
		var imageSize 	= this._imageSize[0],
			topleft 	= map.options.crs.pointToLatLng(L.point(0, 0), 0),
		    bottomright = map.options.crs.pointToLatLng(L.point(imageSize.x, imageSize.y), 0),
		    bounds 		= L.latLngBounds(topleft, bottomright);
			
			
		return bounds;
		//[[75, -132], [-30, 128]]
	},
	
	getCenterZoom: function(map) {
		var mapSize = map.getSize(),
			zoom = this._getBestFitZoom(mapSize),
			imageSize = this._imageSize[zoom],
			center = map.options.crs.pointToLatLng(L.point(imageSize.x / 2, imageSize.y / 2), zoom);
			
		return {
			center: center,
			lat: 	center.lat,
			lon: 	center.lng,
			zoom: 	zoom
		};
	},

	_getGridSize: function (imageSize) {
		var tileSize = this.options.tileSize;
		return L.point(Math.ceil(imageSize.x / tileSize), Math.ceil(imageSize.y / tileSize));
	},

	_getBestFitZoom: function (mapSize) {
		var tolerance = this.options.tolerance,
			zoom = this._imageSize.length - 1,
			imageSize, zoom;

		while (zoom) {
			imageSize = this._imageSize[zoom];
			if (imageSize.x * tolerance < mapSize.x && imageSize.y * tolerance < mapSize.y) {
				return zoom;
			}			
			zoom--;
		}

		return zoom;
	},

	_tileShouldBeLoaded: function (tilePoint) {
		var gridSize = this._gridSize[this._map.getZoom()];
		return (tilePoint.x >= 0 && tilePoint.x < gridSize.x && tilePoint.y >= 0 && tilePoint.y < gridSize.y);
	},

	_addTile: function (tilePoint, container) {
		var tilePos = this._getTilePos(tilePoint),
			tile = this._getTile(),
			zoom = this._map.getZoom(),
			imageSize = this._imageSize[zoom],
			gridSize = this._gridSize[zoom],
			tileSize = this.options.tileSize;

		if (tilePoint.x === gridSize.x - 1) {
			tile.style.width = imageSize.x - (tileSize * (gridSize.x - 1)) + 'px';
		} 

		if (tilePoint.y === gridSize.y - 1) {
			tile.style.height = imageSize.y - (tileSize * (gridSize.y - 1)) + 'px';			
		} 

		L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome || L.Browser.android23);

		this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
		this._loadTile(tile, tilePoint);

		if (tile.parentNode !== this._tileContainer) {
			container.appendChild(tile);
		}
	},

	getTileUrl: function (tilePoint) {
		return this._url + 'TileGroup' + this._getTileGroup(tilePoint) + '/' + this._map.getZoom() + '-' + tilePoint.x + '-' + tilePoint.y + '.jpg';
	},

	_getTileGroup: function (tilePoint) {
		var zoom = this._map.getZoom(),
			num = 0,
			gridSize;

		for (z = 0; z < zoom; z++) {
			gridSize = this._gridSize[z];
			num += gridSize.x * gridSize.y; 
		}	

		num += tilePoint.y * this._gridSize[zoom].x + tilePoint.x;
      	return Math.floor(num / 256);;
	}

});

L.tileLayer.zoomify = function (url, options) {
	return new L.TileLayer.Zoomify(url, options);
};