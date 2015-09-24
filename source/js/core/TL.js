/*!
	TL
*/

(function (root) {
	root.TL = {
		VERSION: '0.1',
		_originalL: root.TL
	};
}(this));

/*	TL.Debug
	Debug mode
================================================== */
TL.debug = false;



/*	TL.Bind
================================================== */
TL.Bind = function (/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
	return function () {
		return fn.apply(obj, arguments);
	};
};



/* Trace (console.log)
================================================== */
trace = function( msg ) {
	if (TL.debug) {
		if (window.console) {
			console.log(msg);
		} else if ( typeof( jsTrace ) != 'undefined' ) {
			jsTrace.send( msg );
		} else {
			//alert(msg);
		}
	}
}
