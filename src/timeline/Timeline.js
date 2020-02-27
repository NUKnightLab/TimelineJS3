import * as DOM from "../dom/DOM"
import { hexToRgb, mergeData, isTrue } from "../core/Util";
import { easeInOutQuint, easeOutStrong } from "../animation/Ease";
import { Message } from "../ui/Message"
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
      this.message = new Message(
          {},
          { message_class: "tl-message-full" },
          this.elem
      );
    }
}

export { Timeline }

