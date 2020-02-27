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
      let foo = hexToRgb("#00ffcc");
      mergeData(foo,{'bar': 'baz', 'quux': 'woop'})
      console.log(foo)
      console.log(`isTrue ${isTrue('true')}`);
      this.elem.innerHTML = `<b>Hello World ${foo}</b>`;
      var msg_options = mergeData(options, { message_class: "tl-message-full" })
      this.message = new Message({}, msg_options, this.elem);
      this.language = new Language(options)
    }
}

export { Timeline }

