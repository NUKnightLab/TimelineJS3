import { Media } from "../Media";
import DOMPurify from 'dompurify';

export default class Blockquote extends Media {
    constructor(data, options, language) { //add_to_container) {
        super(data, options, language);
        this.blockquote = DOMPurify.sanitize(this.data.url)
    }
    _loadMedia() {
        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-blockquote", this._el.content);
        this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";

        // API Call
        this._el.content_item.innerHTML = this.blockquote;

        // After Loaded
        this.onLoaded();
    }

    updateMediaDisplay() {
        // override DOM-oriented updates that don't apply to blockquotes	
    }

}