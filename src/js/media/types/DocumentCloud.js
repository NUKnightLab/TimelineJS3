import { trace, unique_ID } from "../../core/Util"
import { Media } from "../Media";
import { loadJS } from "../../core/Load";

export default class DocumentCloud extends Media {

    _loadMedia() {
        var self = this;

        // Create Dom elements
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-documentcloud tl-media-shadow", this._el.content);
        this._el.content_item.id = unique_ID(7)

        // Check url
        if (this.data.url.match(/\.html$/)) {
            this.data.url = this._transformURL(this.data.url);
        } else if (!(this.data.url.match(/.(json|js)$/))) {
            trace("DOCUMENT CLOUD IN URL BUT INVALID SUFFIX");
        }

        // Load viewer API
        loadJS([
                'https://assets.documentcloud.org/viewer/loader.js',
                'https://assets.documentcloud.org/viewer/viewer.js'
            ],
            function() {
                self.createMedia();
            }
        );
    }

    // Viewer API needs js, not html
    _transformURL(url) {
        return url.replace(/(.*)\.html$/, '$1.js')
    }

    // Update Media Display
    _updateMediaDisplay() {
        this._el.content_item.style.height = this.options.height + "px";
        //this._el.content_item.style.width = this.options.width + "px";
    }

    createMedia() {
        // DocumentCloud API call
        // DV is defined by the JS load in _loadMedia
        DV.load(this.data.url, {
            container: '#' + this._el.content_item.id,
            showSidebar: false
        });
        this.onLoaded();
    }


}