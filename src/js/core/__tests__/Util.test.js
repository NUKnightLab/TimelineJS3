import {
    hexToRgb,
    rgbToHex,
    maxDepth,
    trim,
    isTrue,
    isEmptyObject,
    findNextGreater,
    findNextLesser,
    ensureUniqueKey,
    linkify,
    parseYouTubeTime,
    stripMarkup
} from "../Util";

test("isEmptyObject", () => {
    //"no keys should be empty"
    let o = {}
    expect(isEmptyObject(o)).toBeTruthy()

    // "empty string should be empty"
    o.foo = "  ";
    expect(isEmptyObject(o)).toBeTruthy()

    // "2 empty strings should be empty"
    o.bar = "";
    expect(isEmptyObject(o)).toBeTruthy()

    // "add null, still should be empty"
    o.baz = null;
    expect(isEmptyObject(o)).toBeTruthy()

    // "adding a string " becomes true
    o.foo = "  not empty  ";
    expect(isEmptyObject(o)).toBeFalsy()

})

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

/* testing trim function */
test("null gets zero length string", () => {
    expect(trim(null)).toBe('')
})
test('trim white space both ends', () => { expect(trim(' bob ')).toBe('bob') })
test('trim white space left', () => { expect(trim('bob ')).toBe('bob') })
test('trim with no white space', () => { expect(trim('bob')).toBe('bob') })
test("trimming a non-empty string returns a true value", () => {
    expect(trim('bob')).toBeTruthy()
})
test("trimming an empty string returns a false value", () => {
    expect(trim('')).toBeFalsy()
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
    expect(trim(random)).toBeTruthy() // "Should get a non-empty string"
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