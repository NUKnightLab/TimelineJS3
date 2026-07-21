import { fallback } from "../Language"
import { classMixin } from "../../core/Util"
import { I18NMixins } from "../I18NMixins"
class MixinTest {

}

classMixin(MixinTest, I18NMixins)

test("Test variable interpolation", () => {
    let msg = fallback._("aria_label_zoomin", { start: 1900, end: 2000 })
    expect(msg).toBe('Show less than 1900 to 2000')
})

test("Test variable interpolation error checking with no context", () => {
    expect(() => {
        let msg = fallback._("aria_label_zoomin")
    }).toThrow()
})

test("Test variable interpolation error checking with partial context", () => {
    expect(() => {
        let msg = fallback._("aria_label_zoomin", { start: 1900 })
    }).toThrow()
})

test("Test interpolation through a mixin", () => {
    let mixin = new MixinTest()
    mixin.setLanguage(fallback)
    let msg = mixin._("aria_label_zoomin", { start: 1900, end: 2000 })
    expect(msg).toBe('Show less than 1900 to 2000')
})