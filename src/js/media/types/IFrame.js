import { Media } from "../Media";
import DOMPurify from 'dompurify';

export default class IFrame extends Media {
    constructor(data, options, language) { //add_to_container) {
        super(data, options, language);
        this.iframe = DOMPurify.sanitize(this.data.url, {
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['frameborder'],
        })
    }

    _loadMedia() {
        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe", this._el.content);

        // API Call
        this._el.content_item.innerHTML = this.iframe;

        // After Loaded
        this.onLoaded();
    }

    // Update Media Display
    _updateMediaDisplay() {
        this._el.content_item.style.height = this.options.height + "px";
    }

}