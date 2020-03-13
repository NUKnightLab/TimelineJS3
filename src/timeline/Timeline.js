// simple test environment to make sure some things work
import * as DOM from "../dom/DOM"
// import { addClass } from "../dom/DOMUtil"
import { hexToRgb, mergeData, isTrue } from "../core/Util";
import { easeInOutQuint, easeOutStrong } from "../animation/Ease";
import { Message } from "../ui/Message"
import { Language } from "../language/Language"
import { Loader } from "../core/Load"
/*
    needed imports: 
        TL.Load.js
        TL.Language
        TL.Browser
        TL.Animate
        TL.TimelineConfig
        TL.TimeNav
        TL.StorySlider
        TL.MenuBar
*/
class Timeline {
    constructor(elem, data, options) {
      this.elem = DOM.get(elem)
      this.options = options || {};
      this.options.language = new Language(this.options);
      this.elem.innerHTML = `<b class='foobar'>Hello World</b>`;

      var msg_options = mergeData(this.options, { message_class: "tl-message-full" })
      this.message = new Message({}, msg_options, this.elem);
      this.loader = new Loader(window.document);
    }
}

export { Timeline }

