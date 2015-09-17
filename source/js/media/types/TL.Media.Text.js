TL.Media.Text = TL.Class.extend({
	
	includes: [TL.Events],
	
	// DOM ELEMENTS
	_el: {
		container: {},
		content_container: {},
		content: {},
		headline: {},
		date: {}
	},
	
	// Data
	data: {
		unique_id: 			"",
		headline: 			"headline",
		text: 				"text"
	},
	
	// Options
	options: {
		title: 			false
	},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		
		TL.Util.setData(this, data);
		
		// Merge Options
		TL.Util.mergeData(this.options, options);
		
		this._el.container = TL.Dom.create("div", "tl-text");
		this._el.container.id = this.data.unique_id;
		
		this._initLayout();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	},
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {
		
	},
	
	hide: function() {
		
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
		//this.onAdd();
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},
	
	headlineHeight: function() {
		return this._el.headline.offsetHeight + 40;
	},
	
	addDateText: function(str) {
		this._el.date.innerHTML = str;
	},
	
	/*	Events
	================================================== */
	onLoaded: function() {
		this.fire("loaded", this.data);
	},
	
	onAdd: function() {
		this.fire("added", this.data);
	},

	onRemove: function() {
		this.fire("removed", this.data);
	},
	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.content_container			= TL.Dom.create("div", "tl-text-content-container", this._el.container);
		
		// Date
		this._el.date 				= TL.Dom.create("h3", "tl-headline-date", this._el.content_container);
		
		// Headline
		if (this.data.headline != "") {
			var headline_class = "tl-headline";
			if (this.options.title) {
				headline_class = "tl-headline tl-headline-title";
			}
			this._el.headline				= TL.Dom.create("h2", headline_class, this._el.content_container);
			this._el.headline.innerHTML		= this.data.headline;
		}

		// Text
		if (this.data.text != "") {
			var text_content = "";

      text_content += TL.Util.htmlify(this.options.autolink == true ? TL.Util.linkify(this.data.text) : this.data.text);

			this._el.content				= TL.Dom.create("div", "tl-text-content", this._el.content_container);
			this._el.content.innerHTML		= text_content;
		}

		// Fire event that the slide is loaded
		this.onLoaded();

	}

});
