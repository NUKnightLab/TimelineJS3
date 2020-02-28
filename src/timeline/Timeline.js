// simple test environment to make sure some things work
import * as DOM from "../dom/DOM"
import { hexToRgb, mergeData, isTrue } from "../core/Util";
import { easeInOutQuint, easeOutStrong } from "../animation/Ease";
import { Message } from "../ui/Message"
import { Language } from "../language/Language"
/*
    needed imports: 
        TL.Ease.easeInOutQuint
        TL.Ease.easeOutStrong
        TL.DomUtil.addClass
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
      this.options = options;
      this.options.language = new Language(options);
      this.elem.innerHTML = `<b>Hello World</b>`;
      var msg_options = mergeData(options, { message_class: "tl-message-full" })
      this.message = new Message({}, msg_options, this.elem);
    }
}

export { Timeline }

