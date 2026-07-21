/*	TLClass
	Class powers the OOP facilities of the library.
================================================== */

import { extend as util_extend } from "./Util"

let TLClass = function () {};

TLClass.extend = function (/*Object*/ props) /*-> Class*/ {
 
	// extended class with the new prototype
	var NewClass = function () {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};

	// instantiate class without calling constructor
	var F = function () {};
	F.prototype = this.prototype;
	var proto = new F();

	proto.constructor = NewClass;
	NewClass.prototype = proto;

	// add superclass access
	NewClass.superclass = this.prototype;

	// add class name
	//proto.className = props;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype' && i !== 'superclass') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		util_extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		util_extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = util_extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	util_extend(proto, props);

	// allow inheriting further
	NewClass.extend = TLClass.extend;

	// method for adding properties to prototype
	NewClass.include = function (props) {
		util_extend(this.prototype, props);
	};

	return NewClass;
};

export { TLClass }
