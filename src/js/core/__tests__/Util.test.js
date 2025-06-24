import {
    hexToRgb,
    rgbToHex,
    maxDepth,
    isTrue,
    findNextGreater,
    findNextLesser,
    ensureUniqueKey,
    linkify,
    parseYouTubeTime,
    stripMarkup,
    pad,
    unique_ID,
    slugify,
    htmlify,
    unhtmlify,
    unlinkify,
    isEven,
    stamp,
    transformMediaURL,
    getUrlVars,
    ratio,
    base58
} from "../Util";



/* testing hexToRgb and rgbToHex function */

test("hexToRgb", () => {
    expect(hexToRgb("#000000")).toMatchObject({ r: 0, g: 0, b: 0 });
})


test("RGB white is Hex white", () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toMatch(/^#ffffff$/i)

})

test("colors convert correctly from rgb string", () => {
    expect(rgbToHex('rgb(218,112,214)')).toMatch(/^#DA70D6$/i)
})

test("components of hexToRgb are correct", () => {
    var rgb = hexToRgb('#DA70D6');
    expect(rgb.r).toBe(218)
    expect(rgb.g).toBe(112)
    expect(rgb.b).toBe(214)
})

test("named colors should work too", () => {
    var from_name = hexToRgb('bisque');
    var from_hex = hexToRgb('#ffe4c4');
    expect(from_name.r).toBe(from_hex.r)
    expect(from_name.g).toBe(from_hex.g)
    expect(from_name.b).toBe(from_hex.b)

})

test("make sure bad values throw exceptions 1", () => {
    expect(() => { rgbToHex("malformed string") }).toThrow()
})

test("make sure bad values throw exceptions 2", () => {
    expect(() => { rgbToHex("rgb(218,112)") }).toThrow()
})

test("make sure bad values throw exceptions 3", () => {
    expect(() => { rgbToHex({ r: 255, g: 255, c: 255 }) }).toThrow()
})

test("make sure a zero value doesn't throw an exception", () => {
    expect(rgbToHex({ r: 0, g: 255, b: 255 })).toMatch(/^#00FFFF$/i)
})

/* testing maxDepth function */

test("maxDepth test 1", () => {
    var test = [
        [0, 1],
        [2, 3],
        [5, 7]
    ];
    expect(maxDepth(test)).toBe(1)
})

test("Max depth 2", () => {
    var test = [
        [0, 5],
        [2, 8],
        [9, 10]
    ];
    expect(maxDepth(test)).toBe(2)
})

test("Max depth 1 (test #2)", () => {
    var test = [
        [0, 3],
        [5, 8],
        [9, 10]
    ];
    expect(maxDepth(test)).toBe(1)
})

test("Max depth 2 (test #2)", () => {
    var test = [
        [0, 3],
        [2, 8],
        [4, 9],
        [15, 20]
    ];
    expect(maxDepth(test)).toBe(2)
})

test("Max depth 3", () => {
    var test = [
        [0, 5],
        [2, 8],
        [4, 9],
        [15, 20]
    ];
    expect(maxDepth(test)).toBe(3)
})

test("Max depth 3 (test #2)", () => {
    var test = [
        [0, 5],
        [2, 8],
        [10, 25],
        [15, 20],
        [18, 27],
        [24, 28],

    ];
    expect(maxDepth(test)).toBe(3)
})



/* isTrue */
test("isTrue  true is true", () => {
    expect(isTrue(true)).toBe(true)
})
test("isTrue false is false", () => {
    expect(isTrue(false)).toBe(false)
})
test("isTrue nothing is false", () => {
    expect(isTrue()).toBe(false)
})
test("isTrue null is false", () => {
    expect(isTrue(null)).toBe(false)
})
test("isTrue 'true' is true", () => {
    expect(isTrue('true')).toBe(true)
})
test("isTrue 1 is true", () => {
    expect(isTrue(1)).toBe(true)
})

test("various findNextGreater and findNextLesser tests", () => {
    var l = [1, 5, 10, 20, 35];
    expect(findNextGreater(l, 1)).toBe(5) // "5 is next greatest after 1"
    expect(findNextGreater(l, 5)).toBe(10) // "10 is next greatest after 5"
    expect(findNextGreater(l, 10)).toBe(20) // "20 is next greatest after 10"
    expect(findNextGreater(l, 15)).toBe(20) // "correctly handle a curr val which isn't in the list"
    expect(findNextGreater(l, 35)).toBe(35) // "handle value at end of list"
    expect(findNextGreater(l, 40)).toBe(40) // "handle value greater than max in list"
    expect(findNextGreater(l, 40, 35)).toBe(35) // "handle greater than max in list with default"

    expect(findNextLesser(l, 1)).toBe(1) // "1 is least"
    expect(findNextLesser(l, 5)).toBe(1) // "1 is least after 5"
    expect(findNextLesser(l, 10)).toBe(5) // "20 is next greatest after 10"
    expect(findNextLesser(l, 15)).toBe(10) // "10 is less than 15 (which isn't in list)"
    expect(findNextLesser(l, 35)).toBe(20) // "20 less than 35"
    expect(findNextLesser(l, 40)).toBe(35) // "35 is less than 40"
    expect(findNextLesser(l, 0, 0)).toBe(0) // "handle less than min in list without default"
    expect(findNextLesser(l, 0, -10)).toBe(-10) // "handle less than min in list with default"
})

test("ensureUniqueKey tests", () => {
    var o = { foo: 1, bar: 2 }
    expect(ensureUniqueKey(o, 'foo') in o).toBeFalsy() // what comes back should not have been in there
    expect(ensureUniqueKey(o, 'baz')).toBe('baz') // "not in there, give it back"
    expect(ensureUniqueKey(o, 'foo')).toBe('foo-2') // "treat existing as 1-based"

    o['foo-2'] = 3;
    expect(ensureUniqueKey(o, 'foo') in o).toBeFalsy() // what comes back should not have been in there

    var random = ensureUniqueKey(o, '');
    expect(random.trim()).toBeTruthy() // "Should get a non-empty string"
    expect(random in o).toBeFalsy() // "empty string should get non-empty unique");

})

test("linkify", () => {
    var text = "This is some text with a URL in it http://knightlab.northwestern.edu and then some more text";
    var linked = linkify(text);
    expect(linked.startsWith('This is some text with a URL in it <a')).toBeTruthy()
    expect(linked.match(/href=['"]http:\/\/knightlab.northwestern.edu['"]/)).toBeTruthy()
    expect(linked.match(/>knightlab.northwestern.edu<\/a>/)).toBeTruthy()

    text = "This is some text with www.google.com in it";
    var linked = linkify(text);
    expect(linked.startsWith('This is some text with <a')).toBeTruthy()
    expect(linked.match(/href=['"]http:\/\/www.google.com['"]/)).toBeTruthy()
    expect(linked.match(/>www.google.com<\/a>/)).toBeTruthy()

    text = "This is some text with support@knightlab.zendesk.com in it";
    var linked = linkify(text);
    expect(linked.startsWith('This is some text with <a')).toBeTruthy()
    expect(linked.match(/href=['"]mailto:support@knightlab.zendesk.com['"]/)).toBeTruthy()
    expect(linked.match(/>support@knightlab.zendesk.com<\/a>/)).toBeTruthy()

    text = "This is text which already has <a href='http://google.com'>a link</a> in it."
    var not_linked = linkify(text);
    expect(not_linked).toBe(text)

    text = 'This is text which already has <a href="http://google.com">a link</a> in it.'
    var not_linked = linkify(text);
    expect(not_linked).toBe(text)

    text = 'This is text which already has <a href=http://google.com>a link</a> in it.'
    var not_linked = linkify(text);
    expect(not_linked).toBe(text)

})

test("parseYouTubeTime", () => {
    expect(parseYouTubeTime('5s')).toBe(5)
    expect(parseYouTubeTime('5s')).toBe(5)
    expect(parseYouTubeTime('1m5s')).toBe(65)
    expect(parseYouTubeTime('2h4m5s')).toBe(7445)
    expect(parseYouTubeTime('5m')).toBe(300)
    expect(parseYouTubeTime('1h')).toBe(3600)
    expect(parseYouTubeTime('')).toBe(0)
    expect(parseYouTubeTime(null)).toBe(0)
    expect(parseYouTubeTime('4:55')).toBe(0)
    expect(parseYouTubeTime(5)).toBe(5)
})

test("linkify", () => {
    var text = "This is some text with a URL in it http://knightlab.northwestern.edu and then some more text";
    var linked = linkify(text);
    expect(linked)
    expect(linked.startsWith('This is some text with a URL in it <a')).toBeTruthy();
    expect(linked.match(/href=['"]http:\/\/knightlab.northwestern.edu['"]/)).toBeTruthy();
    expect(linked.match(/>knightlab.northwestern.edu<\/a>/)).toBeTruthy();

    text = "This is some text with www.google.com in it";
    var linked = linkify(text);
    expect(linked.startsWith('This is some text with <a')).toBeTruthy();
    expect(linked.match(/href=['"]http:\/\/www.google.com['"]/)).toBeTruthy();
    expect(linked.match(/>www.google.com<\/a>/)).toBeTruthy();

    text = "This is some text with support@knightlab.zendesk.com in it";
    var linked = linkify(text);
    expect(linked.startsWith('This is some text with <a')).toBeTruthy();
    expect(linked.match(/href=['"]mailto:support@knightlab.zendesk.com['"]/)).toBeTruthy();
    expect(linked.match(/>support@knightlab.zendesk.com<\/a>/)).toBeTruthy();

    text = "This is text which already has <a href='http://google.com'>a link</a> in it."
    var not_linked = linkify(text);
    expect(not_linked).toBe(text)

    text = 'This is text which already has <a href="http://google.com">a link</a> in it.'
    var not_linked = linkify(text);
    expect(not_linked).toBe(text)

    text = 'This is text which already has <a href=http://google.com>a link</a> in it.'
    var not_linked = linkify(text);
    expect(not_linked).toBe(text)

})

test("stripMarkup", () => {
    var input = "<a href='https://knightlab.northwestern.edu'>this is the link text</a>"
    expect(stripMarkup(input)).toBe('this is the link text')

    input = "<a href='https://knightlab.northwestern.edu'>this is the link text"
    expect(stripMarkup(input)).toBe('this is the link text')

    input = "<h1>here's some text</h1>"
    expect(stripMarkup(input)).toBe('here\'s some text')

    input = "<h1>here's some text</h1"
    expect(stripMarkup(input)).toBe('here\'s some text')

    input = "here's some text"
    expect(stripMarkup(input)).toBe('here\'s some text')

    input = "here's an entity &amp; and more text"
    expect(stripMarkup(input)).toBe('here\'s an entity & and more text')

})

test("pad", () => {
    expect(pad("5")).toBe("05")
    expect(pad("5", 3)).toBe("005")
    expect(pad("123", 2)).toBe("123") // already longer than pad length
    expect(pad("12", 2)).toBe("12") // exactly the right length
    expect(pad("", 3)).toBe("000") // empty string
    expect(pad(5)).toBe("05") // number input
    expect(pad("abc", 5)).toBe("00abc") // non-numeric string
})

test("unique_ID", () => {
    const id1 = unique_ID(6)
    const id2 = unique_ID(6)
    expect(id1).not.toBe(id2) // should be unique
    expect(id1.length).toBe(9) // "tl-" + exactly 6 chars (bug fixed!)
    expect(id1.startsWith("tl-")).toBe(true)

    const id3 = unique_ID(4, "test")
    expect(id3.length).toBe(9) // "test-" + exactly 4 chars
    expect(id3.startsWith("test-")).toBe(true)

    const id4 = unique_ID(3)
    expect(id4.length).toBe(6) // "tl-" + exactly 3 chars
})

test("isEven", () => {
    expect(isEven(2)).toBe(true)
    expect(isEven(3)).toBe(false)
    expect(isEven(0)).toBe(true)
    expect(isEven(-2)).toBe(true)
    expect(isEven(-3)).toBe(false)
    expect(isEven(2.0)).toBe(true) // whole number as float
    expect(isEven(2.5)).toBe(false) // not a whole number returns false, not undefined
    expect(isEven("not a number")).toBe(undefined) // non-numeric returns undefined
})

test("slugify", () => {
    expect(slugify("Hello World")).toBe("hello-world")
    expect(slugify("  Hello World  ")).toBe("hello-world") // trim whitespace
    expect(slugify("Hello-World")).toBe("hello-world")
    expect(slugify("Hello_World")).toBe("hello-world")
    expect(slugify("Café")).toBe("cafe") // remove accents
    expect(slugify("Hello & World")).toBe("hello-world") // remove special chars
    expect(slugify("123 Test")).toBe("_123-test") // prefix numbers with underscore
    expect(slugify("")).toBe("") // empty string
})

test("htmlify", () => {
    expect(htmlify("Hello world")).toBe("<p>Hello world</p>")
    expect(htmlify("<p>Already wrapped</p>")).toBe("<p>Already wrapped</p>")
    expect(htmlify("<p>Multiple</p><p>paragraphs</p>")).toBe("<p>Multiple</p><p>paragraphs</p>")
    expect(htmlify("")).toBe("<p></p>")
})

test("unhtmlify", () => {
    expect(unhtmlify("<p>Hello world</p>")).toBe("Hello world")
    expect(unhtmlify("<h1>Title</h1><p>Content</p>")).toBe("TitleContent")
    expect(unhtmlify('Text with "quotes"')).toBe("Text with 'quotes\"") // only replaces FIRST double quote
    expect(unhtmlify("Plain text")).toBe("Plain text")
    expect(unhtmlify('"First quote"')).toBe("'First quote\"") // shows the replacement pattern
})

test("unlinkify", () => {
    expect(unlinkify("<a href='http://example.com'>Link text</a>")).toBe("Link text")
    expect(unlinkify("No links here")).toBe("No links here")
    expect(unlinkify("<a href='http://example.com'>Link</a> and more text")).toBe("Link and more text")
    expect(unlinkify("")).toBe("")
    expect(unlinkify(null)).toBe(null) // handle null input
})

test("stamp", () => {
    const obj1 = {}
    const obj2 = {}

    const id1 = stamp(obj1)
    const id2 = stamp(obj2)

    expect(id1).toBe(1) // first object gets ID 1
    expect(id2).toBe(2) // second object gets ID 2
    expect(obj1._tl_id).toBe(1) // ID is stored on object
    expect(obj2._tl_id).toBe(2)

    // Calling stamp again on same object returns same ID
    expect(stamp(obj1)).toBe(1)
    expect(stamp(obj2)).toBe(2)

    // New object gets next ID
    const obj3 = {}
    expect(stamp(obj3)).toBe(3)
})

test("transformMediaURL", () => {
    expect(transformMediaURL("https://www.dropbox.com/s/abc123/image.jpg")).toBe("https://dl.dropboxusercontent.com/s/abc123/image.jpg")
    expect(transformMediaURL("http://www.dropbox.com/s/xyz789/doc.pdf")).toBe("http://dl.dropboxusercontent.com/s/xyz789/doc.pdf")
    expect(transformMediaURL("https://example.com/image.jpg")).toBe("https://example.com/image.jpg") // non-dropbox URLs unchanged
    expect(transformMediaURL("")).toBe("") // empty string
})

test("getUrlVars", () => {
    expect(getUrlVars("?a=1&b=2&c=3")).toEqual(expect.objectContaining({
        a: "1",
        b: "2",
        c: "3"
    }))
    expect(getUrlVars("?single=value")).toEqual(expect.objectContaining({
        single: "value"
    }))
    expect(getUrlVars("?")).toEqual(expect.arrayContaining([])) // just question mark
    expect(getUrlVars("?encoded&#038;param=value")).toEqual(expect.objectContaining({
        "param": "value"
    })) // handles encoded ampersands
})





test("ratio.square", () => {
    expect(ratio.square({w: 100, h: 50})).toEqual({w: 50, h: 50}) // width > height, use height
    expect(ratio.square({w: 50, h: 100})).toEqual({w: 50, h: 50}) // height > width, use width
    expect(ratio.square({w: 100, h: 100})).toEqual({w: 100, h: 100}) // already square
    expect(ratio.square({w: 0, h: 100})).toEqual({w: 0, h: 0}) // zero width
})

test("ratio.r16_9", () => {
    expect(ratio.r16_9({w: 160})).toBe(90) // 160/16*9 = 90
    expect(ratio.r16_9({w: null, h: 90})).toBe(160) // when w is null, use h: 90/9*16 = 160
    expect(ratio.r16_9({w: "", h: 90})).toBe(160) // when w is empty, use h: 90/9*16 = 160
    expect(ratio.r16_9({w: null})).toBe(0) // Fixed: now returns 0 instead of NaN
    expect(ratio.r16_9({w: ""})).toBe(0) // Fixed: now returns 0 instead of NaN
})

test("ratio.r4_3", () => {
    expect(ratio.r4_3({w: 400})).toBe(300) // 400/4*3 = 300
    expect(ratio.r4_3({w: null, h: 300})).toBe(400) // when w is null, use h: 300/3*4 = 400
    expect(ratio.r4_3({w: "", h: 300})).toBe(400) // when w is empty, use h: 300/3*4 = 400
    expect(ratio.r4_3({w: null})).toBe(0) // Fixed: now returns 0 instead of NaN
    expect(ratio.r4_3({w: ""})).toBe(0) // Fixed: now returns 0 instead of NaN
})

test("base58.encode", () => {
    expect(base58.encode(123)).toBe("38") // actual encoding result
    expect(base58.encode(0)).toBe("") // zero
    expect(base58.encode(1)).toBe("2") // first character in alphabet
    expect(() => base58.encode("not a number")).toThrow() // should throw for non-numbers
    expect(() => base58.encode(1.5)).toThrow() // should throw for non-integers
})

test("base58.decode", () => {
    expect(base58.decode("38")).toBe(123) // actual decoding result
    expect(base58.decode("2")).toBe(1) // first character
    expect(() => base58.decode(123)).toThrow() // should throw for non-strings
    expect(() => base58.decode("0")).toThrow() // should throw for invalid characters (0 not in alphabet)
})
