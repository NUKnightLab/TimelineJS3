import * as DOM from "../dom/DOM"
import * as Browser from "../core/Browser"
import Events from "../core/Events";
import { DOMMixins } from "../dom/DOMMixins"
import { easeInOutQuint } from "../animation/Ease"
import { classMixin, mergeData } from "../core/Util"
import { addClass, removeClass } from "../dom/DOMUtil"
import { DOMEvent } from "../dom/DOMEvent"

export class MenuBar {
	constructor(elem, parent_elem, options) {
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			button_backtostart: {},
			button_zoomin: {},
			button_zoomout: {},
			arrow: {},
			line: {},
			coverbar: {},
			grip: {}
		};

		this.collapsed = false;

		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = DOM.get(elem);
		}

		if (parent_elem) {
			this._el.parent = parent_elem;
		}

		//Options
		this.options = {
			width: 					600,
			height: 				600,
			duration: 				1000,
			ease: 					easeInOutQuint,
			menubar_default_y: 		0
		};

		// Animation
		this.animator = {};

		// Merge Data and Options
		mergeData(this.options, options);

		this._initLayout();
		this._initEvents();
	}

	/*	Public
	================================================== */
	show(d) {

		var duration = this.options.duration;
		if (d) {
			duration = d;
		}
	}

	hide(top) {
	}

	toogleZoomIn(show) {
		if (show) {
      removeClass(this._el.button_zoomin,'tl-menubar-button-inactive');
		} else {
      addClass(this._el.button_zoomin,'tl-menubar-button-inactive');
		}
	}

	toogleZoomOut(show) {
		if (show) {
      removeClass(this._el.button_zoomout,'tl-menubar-button-inactive');
		} else {
      addClass(this._el.button_zoomout,'tl-menubar-button-inactive');
		}
	}

	setSticky(y) {
		this.options.menubar_default_y = y;
	}

	/*	Color
	================================================== */
	setColor(inverted) {
		if (inverted) {
			this._el.container.className = 'tl-menubar tl-menubar-inverted';
		} else {
			this._el.container.className = 'tl-menubar';
		}
	}

	/*	Update Display
	================================================== */
	updateDisplay(w, h, a, l) {
		this._updateDisplay(w, h, a, l);
	}


	/*	Events
	================================================== */
	_onButtonZoomIn(e) {
		this.fire("zoom_in", e);
	}

	_onButtonZoomOut(e) {
		this.fire("zoom_out", e);
	}

	_onButtonBackToStart(e) {
		this.fire("back_to_start", e);
	}


	/*	Private Methods
	================================================== */
	_initLayout () {

		// Create Layout
		this._el.button_zoomin = DOM.create('button', 'tl-menubar-button', this._el.container);
		this._el.button_zoomout = DOM.create('button', 'tl-menubar-button', this._el.container);
		this._el.button_backtostart = DOM.create('button', 'tl-menubar-button', this._el.container);

		if (Browser.mobile) {
			this._el.container.setAttribute("ontouchstart"," ");
		}

		this._el.button_backtostart.innerHTML		= "<span class='tl-icon-goback'></span>";
		this._el.button_zoomin.innerHTML			= "<span class='tl-icon-zoom-in'></span>";
		this._el.button_zoomout.innerHTML			= "<span class='tl-icon-zoom-out'></span>";


	}

	_initEvents () {
		DOMEvent.addListener(this._el.button_backtostart, 'click', this._onButtonBackToStart, this);
		DOMEvent.addListener(this._el.button_zoomin, 'click', this._onButtonZoomIn, this);
		DOMEvent.addListener(this._el.button_zoomout, 'click', this._onButtonZoomOut, this);
	}

	// Update Display
	_updateDisplay(width, height, animate) {

		if (width) {
			this.options.width = width;
		}
		if (height) {
			this.options.height = height;
		}
	}

}

classMixin(MenuBar, DOMMixins, Events)
