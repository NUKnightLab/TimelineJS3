import { Media } from "../Media";

export default class GoogleDoc extends Media {

    /*	Load the media
    ================================================== */
    _loadMedia() {
        var url,
            self = this;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-iframe", this._el.content);

        // Get Media ID
        if (this.data.url.match(/open\?id=([^&]+)/)) {
            var doc_id = this.data.url.match(/open\?id=([^&]+)/)[1];
            url = 'https://drive.google.com/file/d/' + doc_id + '/preview'
        } else if (this.data.url.match(/file\/d\/([^/]*)\/?/)) {
            var doc_id = this.data.url.match(/file\/d\/([^/]*)\/?/)[1];
            url = 'https://drive.google.com/file/d/' + doc_id + '/preview'
        } else {
            url = this.data.url;
        }

        // this URL makes something suitable for an img src but what if it's not an image?
        // api_url = "http://www.googledrive.com/host/" + this.media_id + "/";

        var iframe = document.createElement("iframe");
        iframe.className = "doc";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("width", "100%");
        iframe.setAttribute("height", "100%");
        iframe.setAttribute("src", url);
        this._el.content_item.appendChild(iframe);

        // After Loaded
        this.onLoaded();
    }

    // Update Media Display
    _updateMediaDisplay() {
        this._el.content_item.style.height = this.options.height + "px";
    }


}