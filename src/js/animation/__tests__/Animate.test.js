import { Animate } from "../Animate"

// jsdom doesn't implement the Web Animations API, so stub el.animate with a
// minimal Animation that tracks whether it is still applied to the element.
let animations
beforeEach(() => {
    animations = []
    HTMLElement.prototype.animate = function(keyframes) {
        const el = this
        const anim = {
            active: true,
            finished: false,
            onfinish: null,
            commitStyles: jest.fn(() => {
                // pretend an unfinished animation is halfway to its target
                el.style.left = anim.finished ? keyframes.left : "50px"
            }),
            cancel: jest.fn(() => { anim.active = false }),
            finish: jest.fn(() => {
                anim.finished = true
                anim.onfinish && anim.onfinish()
            })
        }
        animations.push(anim)
        return anim
    }
})
afterEach(() => {
    delete HTMLElement.prototype.animate
})

test("finished animation is removed and calls complete", () => {
    const el = document.createElement("div")
    const complete = jest.fn()
    Animate(el, { left: "100px", duration: 10, complete })
    animations[0].onfinish()
    expect(animations[0].commitStyles).toHaveBeenCalled()
    // a lingering fill: 'forwards' animation would override later inline styles
    expect(animations[0].active).toBe(false)
    expect(complete).toHaveBeenCalledTimes(1)
})

test("stop() leaves the element where it is and skips complete", () => {
    const el = document.createElement("div")
    el.style.left = "0px"
    const complete = jest.fn()
    const animator = Animate(el, { left: "100px", duration: 10, complete })
    animator.stop()
    expect(el.style.left).toBe("50px")
    expect(animations[0].active).toBe(false)
    expect(complete).not.toHaveBeenCalled()
})

test("stop(true) jumps to the end and calls complete once", () => {
    const el = document.createElement("div")
    const complete = jest.fn()
    const animator = Animate(el, { left: "100px", duration: 10, complete })
    animator.stop(true)
    expect(el.style.left).toBe("100px")
    expect(animations[0].active).toBe(false)
    expect(complete).toHaveBeenCalledTimes(1)
})
