import * as DOM from "../dom/DOM"
/*
    needed imports: 
        TL.Dom (obsolete?)
        TL.StyleSheet
        TL.Ease.easeInOutQuint
        TL.Ease.easeOutStrong
        TL.Message
        TL.Util.hexToRgb
        TL.Util.mergeData
        TL.Util.isTrue
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

		this.elem.innerHTML = `<b>Hello World</b>`;

    }
}

export { Timeline }

