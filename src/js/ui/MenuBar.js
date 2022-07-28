import * as DOM from "../dom/DOM"
import * as Browser from "../core/Browser"
import Events from "../core/Events";
import { DOMMixins } from "../dom/DOMMixins"
import { easeInOutQuint } from "../animation/Ease"
import { classMixin, mergeData } from "../core/Util"
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

        // Data
        this.data = {
            visible_ticks_dates: {}
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
            this._el.button_zoomin.removeAttribute('disabled');
        } else {
            this._el.button_zoomin.setAttribute('disabled', true);
        }
	}

	toogleZoomOut(show) {
        if (show) {
            this._el.button_zoomout.removeAttribute('disabled');
        } else {
            this._el.button_zoomout.setAttribute('disabled', true);
        }
	}

    changeVisibleTicks(visible_ticks) {
        const minor_ticks = visible_ticks.minor;
        if (!minor_ticks.length) {
            this.data.visible_ticks_dates = {};
            return;
        }

        const firstTick = minor_ticks[0];
        const firstYear = this._getTickYear(firstTick);

        const lastTick = minor_ticks[minor_ticks.length - 1];
        const lastYear = this._getTickYear(lastTick);

        this.data.visible_ticks_dates = {
            start: firstYear,
            end: lastYear
        };

        this._updateZoomAriaLabels()
    }

    _getTickYear(tick) {
        return tick.date.data.date_obj.getFullYear();
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

    getFormattedTimespan() {
        const { start, end } = this.data.visible_ticks_dates;
        return start && end ? `than ${start} to ${end}` : "";
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

		this._el.button_backtostart.innerHTML = "<span class='tl-icon-goback'></span>";
        this._el.button_backtostart.setAttribute('aria-label', 'Back to start');

		this._el.button_zoomin.innerHTML = "<span class='tl-icon-zoom-in'></span>";
        this._el.button_zoomin.setAttribute('aria-label', 'Zoom in');

		this._el.button_zoomout.innerHTML = "<span class='tl-icon-zoom-out'></span>";
        this._el.button_zoomout.setAttribute('aria-label', 'Zoom out');
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

    // Update Display
    _updateZoomAriaLabels() {
        const timespan = this.getFormattedTimespan();
        if (!timespan) {
            this._el.button_zoomin.setAttribute('aria-description', '');
            this._el.button_zoomout.setAttribute('aria-description', '');
            return;
        }

        this._el.button_zoomin.setAttribute('aria-description', `Show less ${timespan}`);
        this._el.button_zoomout.setAttribute('aria-description', `Show more ${timespan}`);
    }
}

classMixin(MenuBar, DOMMixins, Events)
