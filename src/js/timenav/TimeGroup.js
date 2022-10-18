import { classMixin, mergeData } from "../core/Util"
import Events from "../core/Events"
import { DOMMixins } from "../dom/DOMMixins"
import { DOMEvent } from "../dom/DOMEvent"
import * as DOM from "../dom/DOM"

export class TimeGroup {
	constructor(data) {
		
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			message: {}
		};
		
		//Options
		this.options = {
			width: 					600,
			height: 				600
		};
		
		// Data
		this.data = {
			label: "",
			rows: 1,
			color: ""
		};
		
		
		this._el.container = DOM.create("div", "tl-timegroup"); 

		
		// Merge Data
		mergeData(this.data, data);
		
		// Animation
		this.animator = {};
		
		
		this._initLayout();
		this._initEvents();

		this._el.container.style.backgroundColor = this.data.color;
	}
	
	/*	Public
	================================================== */
	
	
	
	/*	Update Display
	================================================== */
	updateDisplay(w, h) {
		
	}
	
	setRowPosition(n, h) {
		this.options.height = h * this.data.rows;
		this.setPosition({top:n});
		this._el.container.style.height = this.options.height + "px";
		
	}
	
	setAlternateRowColor(alternate, hide) {
		var class_name = "tl-timegroup";
		if (alternate) {
			class_name += " tl-timegroup-alternate";
		}
		if (hide) {
			class_name += " tl-timegroup-hidden";
		}
		this._el.container.className = class_name;
	}
	
	/*	Events
	================================================== */

	
	_onMouseClick() {
		this.fire("clicked", this.options);
	}

	
	/*	Private Methods
	================================================== */
	_initLayout () {
		
		// Create Layout
		this._el.message = DOM.create("div", "tl-timegroup-message ", this._el.container);
		
		//set background color and hover
		this._el.message.style.backgroundColor = this.data.color;
		this._el.message.style.filter = "brightness(98%)";
		this._el.message.style.padding = "2px 2px 3px 2";
		this._el.message.innerHTML = this.data.label;
		
		
		
	}
	
	_initEvents () {
		DOMEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	// Update Display
	_updateDisplay(width, height, animate) {
		
	}
	
}

classMixin(TimeGroup, Events, DOMMixins)
