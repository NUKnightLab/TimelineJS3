import { fallback } from "../Language"
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
