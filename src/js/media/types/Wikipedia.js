import { Media } from "../Media";
import { ajax } from "../../net/Net"
import { getObjectAttributeByIndex } from "../../core/Util"

export default class Wikipedia extends Media {

    _loadMedia() {
        var api_url,
            api_language,
            self = this;

        // Create Dom element
        this._el.content_item = this.domCreate("div", "tl-media-item tl-media-wikipedia", this._el.content);
        this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";

        // Get Media ID
        this.media_id = this.data.url.split("wiki\/")[1].split("#")[0].replace("_", " ");
        this.media_id = this.media_id.replace(" ", "%20");
        api_language = this.data.url.split("//")[1].split(".wikipedia")[0];

        // API URL
        api_url = "https://" + api_language + ".wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&redirects=&titles=" + this.media_id + "&exintro=1&format=json&callback=?";

        // API Call
        ajax({
            type: 'GET',
            url: api_url,
            dataType: 'json', //json data type

            success: function(d) {
                self.createMedia(d);
            },
            error: function(xhr, type) {
                var error_text = "";
                error_text += self._("wikipedia_load_err") + "<br/>" + self.media_id + "<br/>" + type;
                self.loadErrorDisplay(error_text);
            }
        });

    }

    createMedia(d) {
        var wiki = "";

        if (d.query) {
            var content = "",
                wiki = {
                    entry: {},
                    title: "",
                    text: "",
                    extract: "",
                    paragraphs: 1,
                    page_image: "",
                    text_array: []
                };

            wiki.entry = getObjectAttributeByIndex(d.query.pages, 0);
            wiki.extract = wiki.entry.extract;
            wiki.title = wiki.entry.title;
            wiki.page_image = wiki.entry.thumbnail;

            if (wiki.extract.match("<p>")) {
                wiki.text_array = wiki.extract.split("<p>");
            } else {
                wiki.text_array.push(wiki.extract);
            }

            for (var i = 0; i < wiki.text_array.length; i++) {
                if (i + 1 <= wiki.paragraphs && i + 1 < wiki.text_array.length) {
                    wiki.text += "<p>" + wiki.text_array[i + 1];
                }
            }


            content += "<span class='tl-icon-wikipedia'></span>";
            content += "<div class='tl-wikipedia-title'><h4><a href='" + this.data.url + "' target='_blank' rel='noopener'>" + wiki.title + "</a></h4>";
            content += "<span class='tl-wikipedia-source'>" + this._('wikipedia') + "</span></div>";

            if (wiki.page_image) {
                //content 	+= 	"<img class='tl-wikipedia-pageimage' src='" + wiki.page_image.source +"'>";
            }

            content += wiki.text;

            if (wiki.extract.match("REDIRECT")) {

            } else {
                // Add to DOM
                this._el.content_item.innerHTML = content;
                // After Loaded
                this.onLoaded();
            }


        }

    }

    updateMediaDisplay() {

    }

}