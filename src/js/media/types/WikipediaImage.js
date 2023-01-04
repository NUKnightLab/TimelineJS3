import { Media } from "../Media";
import { getJSON, fetchJSON } from "../../net/Net";
import TLError from "../../core/TLError";
import { unhtmlify } from "../../core/Util";

export function computeMediaId(url) {

    if (url.match(/^.+#\/media\/.+/)) {
        let parts = url.split('#')
        let file_parts = parts[1].split(':') // the prefix is File in English but different on other language WPs
        return `File:${file_parts[1]}`
    }

    if (url.match(/^.*commons.wikimedia.org\/wiki\/File:.+/)) {
        let parts = url.split('/')
        return parts[parts.length - 1]
    }

    return null
}

/**
 * Given a JSON response from a Wikimedia Commons API call, extract the base thumbnail URL 
 * and the page ID, which can be used to get alt text later.
 * We assume that there is only one meaningful result in the object.
 * 
 * @param {Object} j 
 */
export function processImageInfoAPIJSON(j) {
    let response = {}
    if (j.query && j.query.pages) {
        let page_ids = Object.keys(j.query.pages)
        response['page_id'] = page_ids[0]
        let data = j.query.pages[response['page_id']]
        response['url'] = data.imageinfo[0].thumburl
        if (data.entityterms && data.entityterms.label) {
            response['label'] = data.entityterms.label[0]
        }
    }
    return response
}

export default class WikipediaImage extends Media {

    _loadMedia() {
        var api_url,
            image_width = this.options.width || 1000,
            language_code = this.getLanguage().lang.toLowerCase(),
            self = this;

        try {
            // Get Media ID
            this.establishMediaID();

            // API URL
            api_url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${this.media_id}&prop=imageinfo|entityterms&iiprop=url&&iiurlwidth=${image_width}&format=json&origin=*&wbetlanguage=${language_code}`
                // API Call
            getJSON(api_url, function(d) {
                let response = processImageInfoAPIJSON(d)
                if (response.url) {
                    self.base_image_url = response.url
                    self.page_id = response.page_id
                    if (!(self.data.alt) && response.label) {
                        self.data.alt = response.label
                    }

                    if (!self.options.background) {
                        self.createMedia();
                    }

                    self.onLoaded();
                } else {
                    self.loadErrorDisplay(self._("wikipedia_image_load_err"));
                }
            });
        } catch (e) {
            self.loadErrorDisplay(self._(e.message_key));
        }
    }

    /**
     * Analyze the URL provided in the data object passed to the constructor to extract
     * the Wikimedia commons "page" name
     */
    establishMediaID() {
        let media_id = computeMediaId(this.data.url)
        if (media_id) {
            this.media_id = media_id
        } else {
            throw new TLError(`Invalid Wikipedia Image URL`)
        }
    }

    createMedia() {
        var self = this;

        // Photo
        this._el.content_item = this.domCreate("img", "tl-media-item tl-media-image tl-media-wikipedia-image tl-media-shadow", this._el.content);

        if (this.data.alt) {
            this._el.content_item.alt = this.data.alt;
        } else if (this.page_id) {
            let wikibase_id = `M${this.page_id}`
            let wikibase_url = `https://commons.wikimedia.org/w/api.php?action=wbgetentities&format=json&ids=${wikibase_id}&format=json&origin=*`
            fetchJSON(wikibase_url).then(j => {
                if (j.entities && j.entities[wikibase_id]) {
                    let labels = j.entities[wikibase_id].labels
                    let language_code = self.getLanguage().lang.toLowerCase()
                    let label = null
                    if (labels[language_code]) {
                        label = labels[language_code]
                    } else if (language_code.length > 2 && labels[language_code.substr(0, 2)]) {
                        label = labels[language_code.substr(0, 2)]
                    } else if (labels['en']) {
                        label = labels['en']
                    }
                    if (label) {
                        console.log(`wikibase_id: ${self.media_id} alt ${label.value}`)
                        self.data.alt = label.value
                        self._el.content_item.alt = self.data.alt
                    } else {
                        console.log(`wikibase_id: ${self.media_id} ain't got no alt`)
                    }
                }
            })
        }

        if (this.data.title) {
            this._el.content_item.title = this.data.title;
        }

        // Media Loaded Event
        this._el.content_item.addEventListener('load', function(e) {
            self.onMediaLoaded();
        });

        // Set Image Source
        this._el.content_item.src = this.getImageURL(this.options.width, this.options.height);
    }

    _getImageURL(w, h) {
        if (w && this.base_image_url) {
            let match = this.base_image_url.match(/(\/\d+px-)/)
            if (match) {
                return this.base_image_url.replace(match[1], `/${w}px-`) // Wikipedia will autoscale the image for us
            }
        }
        // they don't always have that pattern!
        return this.base_image_url
    }

}

/**
 * 
 * 
 * https://commons.wikimedia.org/w/api.php?action=query&titles=File:Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg&prop=imageinfo&iiprop=url&&iiurlwidth=1000
 * https://commons.wikimedia.org/wiki/File:Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg
 */