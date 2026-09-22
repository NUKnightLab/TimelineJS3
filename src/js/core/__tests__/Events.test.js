import Events from "../Events"

test("fire passes type, target and data to listeners", () => {
    const e = new Events()
    let received = null
    e.on("change", data => { received = data })
    e.fire("change", { unique_id: "abc" })
    expect(received.type).toBe("change")
    expect(received.target).toBe(e)
    expect(received.unique_id).toBe("abc")
})

test("distinct bound functions are all called", () => {
    const e = new Events()
    const calls = []
    const obj = { a() { calls.push("A") }, b() { calls.push("B") } }
    e.on("change", obj.a.bind(obj))
    e.on("change", obj.b.bind(obj))
    e.fire("change")
    expect(calls).toEqual(["A", "B"])
})

test("same function with different contexts is called once per context", () => {
    const e = new Events()
    const calls = []
    function handler() { calls.push(this.name) }
    e.on("change", handler, { name: "first" })
    e.on("change", handler, { name: "second" })
    e.fire("change")
    expect(calls).toEqual(["first", "second"])
})

test("context defaults to the event source", () => {
    const e = new Events()
    let ctx = null
    e.on("change", function() { ctx = this })
    e.fire("change")
    expect(ctx).toBe(e)
})

test("off with context removes only the matching listener", () => {
    const e = new Events()
    const calls = []
    function handler() { calls.push(this.name) }
    const first = { name: "first" }, second = { name: "second" }
    e.on("change", handler, first)
    e.on("change", handler, second)
    e.off("change", handler, second)
    e.fire("change")
    expect(calls).toEqual(["first"])
})

test("off without context removes a listener registered with one", () => {
    const e = new Events()
    const handler = jest.fn()
    e.on("change", handler, {})
    e.off("change", handler)
    e.fire("change")
    expect(handler).not.toHaveBeenCalled()
})

test("hasEventListeners reflects registrations", () => {
    const e = new Events()
    const handler = () => {}
    expect(e.hasEventListeners("change")).toBe(false)
    e.on("change", handler)
    expect(e.hasEventListeners("change")).toBe(true)
    e.off("change", handler)
    expect(e.hasEventListeners("change")).toBe(false)
})

test("on requires a callback", () => {
    expect(() => new Events().on("change")).toThrow()
})
