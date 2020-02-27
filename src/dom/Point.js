/*	TL.Point
	Inspired by Leaflet
	TL.Point represents a point with x and y coordinates.
================================================== */

TL.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};

TL.Point.prototype = {
	add: function (point) {
		return this.clone()._add(point);
	},

	_add: function (point) {
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	subtract: function (point) {
		return this.clone()._subtract(point);
	},

	// destructive subtract (faster)
	_subtract: function (point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	divideBy: function (num, round) {
		return new TL.Point(this.x / num, this.y / num, round);
	},

	multiplyBy: function (num) {
		return new TL.Point(this.x * num, this.y * num);
	},

	distanceTo: function (point) {
		var x = point.x - this.x,
			y = point.y - this.y;
		return Math.sqrt(x * x + y * y);
	},

	round: function () {
		return this.clone()._round();
	},

	// destructive round
	_round: function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	clone: function () {
		return new TL.Point(this.x, this.y);
	},

	toString: function () {
		return 'Point(' +
				TL.Util.formatNum(this.x) + ', ' +
				TL.Util.formatNum(this.y) + ')';
	}
};