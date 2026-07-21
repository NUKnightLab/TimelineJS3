import Events from "../core/Events";
import { DOMMixins } from "../dom/DOMMixins";
import { classMixin, mergeData, unlinkify } from "../core/Util"
import * as DOM from "../dom/DOM"
import { DOMEvent } from "../dom/DOMEvent"
import * as Browser from "../core/Browser"

export class SlideNav {
	
	constructor(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			content_container: {},
			icon: {},
			title: {},
			description: {}
		};
	
		// Media Type
		this.mediatype = {};
		
		// Data
		this.data = {
			title: "Navigation",
			description: "Description",
			date: "Date"
		};
	
		//Options
		this.options = {
			direction: 			"previous"
		};
	
		this.animator = null;
		
		// Merge Data and Options
		mergeData(this.options, options);
		mergeData(this.data, data);
		
		
		this._el.container = DOM.create("button", "tl-slidenav-" + this.options.direction);
		
		if (Browser.mobile) {
			this._el.container.setAttribute("ontouchstart"," ");
		}
		
		this._initLayout();
		this._initEvents();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	}
	
	/*	Update Content
	================================================== */
	update(slide) {
		var d = {
			title: "",
			description: "",
			date: slide.getFormattedDate()
		};
		
		if (slide.data.text) {
			if (slide.data.text.headline) {
				d.title = slide.data.text.headline;
			}
		}

		this._update(d);
	}
	
	/*	Color
	================================================== */
	setColor(inverted) {
		if (inverted) {
			this._el.content_container.className = 'tl-slidenav-content-container tl-slidenav-inverted';
		} else {
			this._el.content_container.className = 'tl-slidenav-content-container';
		}
	}
	
	/*	Events
	================================================== */
	_onMouseClick() {
		this.fire("clicked", this.options);
	}
	
	/*	Private Methods
	================================================== */
	_update(d) {
		// update data
		this.data = mergeData(this.data, d);

        // Title
        const title = unlinkify(this.data.title);
        this._el.title.innerHTML = title;

        // Date
        const date = unlinkify(this.data.date);
        this._el.description.innerHTML = date;

        // Alternative text
        this._el.container.setAttribute('aria-label', `${this.options.direction}, ${title}, ${date}`)
	}
	
	_initLayout () {
		
		// Create Layout
		this._el.content_container			= DOM.create("div", "tl-slidenav-content-container", this._el.container);
		this._el.icon						= DOM.create("div", "tl-slidenav-icon", this._el.content_container);
		this._el.title = DOM.create("div", "tl-slidenav-title", this._el.content_container);
		this._el.description = DOM.create("div", "tl-slidenav-description", this._el.content_container);
		
		this._el.icon.innerHTML				= "&nbsp;"
		
		this._update();
	}
	
	_initEvents () {
		DOMEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
}

classMixin(SlideNav, DOMMixins, Events)
