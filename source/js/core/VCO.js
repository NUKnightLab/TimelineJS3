/*!
	VCO
*/

(function (root) {
	root.VCO = {
		VERSION: '0.1',
		_originalL: root.VCO
	};
}(this));

/*	VCO.Debug
	Debug mode
================================================== */
VCO.debug = true;



/*	VCO.Bind
================================================== */
VCO.Bind = function (/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
	return function () {
		return fn.apply(obj, arguments);
	};
};



/* Trace (console.log)
================================================== */
trace = function( msg ) {
	if (VCO.debug) {
		if (window.console) {
			console.log(msg);
		} else if ( typeof( jsTrace ) != 'undefined' ) {
			jsTrace.send( msg );
		} else {
			//alert(msg);
		}
	}
}