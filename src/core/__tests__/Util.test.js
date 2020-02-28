import { hexToRgb, rgbToHex, maxDepth, trim, isTrue } from "../Util";

/* testing hexToRgb and rgbToHex function */

test("hexToRgb", () => {
    expect(hexToRgb("#000000")).toMatchObject({ r: 0, g: 0, b: 0 });    
} )


test("RGB white is Hex white", () => {
    expect(rgbToHex({r: 255, g: 255, b: 255})).toMatch(/^#ffffff$/i)

}) 

test("colors convert correctly from rgb string", ()=>{
    expect(rgbToHex('rgb(218,112,214)')).toMatch(/^#DA70D6$/i)
})

test("components of hexToRgb are correct", ()=>{
         var rgb = hexToRgb('#DA70D6');
         expect(rgb.r).toBe(218)
         expect(rgb.g).toBe(112)
         expect(rgb.b).toBe(214)
})

test("named colors should work too",()=>{
    var from_name = hexToRgb('bisque');
    var from_hex = hexToRgb('#ffe4c4');
    expect(from_name.r).toBe(from_hex.r)
    expect(from_name.g).toBe(from_hex.g)
    expect(from_name.b).toBe(from_hex.b)
       
})

test("make sure bad values throw exceptions 1",()=>{
    expect(()=>{rgbToHex("malformed string")}).toThrow()
})

test("make sure bad values throw exceptions 2",()=>{
    expect(()=>{rgbToHex("rgb(218,112)")}).toThrow()
})

test("make sure bad values throw exceptions 3",()=>{
    expect(()=>{rgbToHex({r: 255, g: 255, c: 255})}).toThrow()
})

test("make sure a zero value doesn't throw an exception",()=>{
    expect(rgbToHex({r: 0, g: 255, b: 255})).toMatch(/^#00FFFF$/i)
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
          [0,5],
          [2,8],
          [9,10]
        ];
        expect(maxDepth(test)).toBe(2)
})

test("Max depth 1 (test #2)", () => {
        var test = [
          [0,3],
          [5,8],
          [9,10]
        ];
        expect(maxDepth(test)).toBe(1)
})

test("Max depth 2 (test #2)", () => {
        var test = [
          [0,3],
          [2,8],
          [4,9],
          [15,20]
        ];
        expect(maxDepth(test)).toBe(2)
})

test("Max depth 3", () => {
        var test = [
          [0,5],
          [2,8],
          [4,9],
          [15,20]
        ];
        expect(maxDepth(test)).toBe(3)
})

test("Max depth 3 (test #2)", () => {
        var test = [
          [0,5],
          [2,8],
          [10,25],
          [15,20],
          [18,27],
          [24,28],

        ];
        expect(maxDepth(test)).toBe(3)
})

/* testing trim function */
test("null gets zero length string", () => { 
    expect(trim(null)).toBe('') 
}) 
test('trim white space both ends', () => { expect(trim(' bob ')).toBe( 'bob') })
test('trim white space left', () => { expect(trim('bob ')).toBe( 'bob') })
test('trim with no white space', () => { expect(trim('bob')).toBe( 'bob') })
test("trimming a non-empty string returns a true value", () => {
    expect(trim('bob')).toBeTruthy()
})
test("trimming an empty string returns a false value", () => {
    expect(trim('')).toBeFalsy()
})

/* isTrue */
test("isTrue  true is true",() => {
    expect(isTrue(true)).toBe(true)
})
test("isTrue false is false",() => {
    expect(isTrue(false)).toBe(false)
})
test("isTrue nothing is false",() => {
    expect(isTrue()).toBe(false)
})
test("isTrue null is false",() => {
    expect(isTrue(null)).toBe(false)
})
test("isTrue 'true' is true",() => {
    expect(isTrue('true')).toBe(true)
})
test("isTrue 1 is true",() => {
    expect(isTrue(1)).toBe(true)
})

/**
.Util.linkify", function(assert) {
        var text = "This is some text with a URL in it http://knightlab.northwestern.edu and then some more text";
        var linked = TL.Util.linkify(text);
        assert.ok(linked.startsWith('This is some text with a URL in it <a'), "should start the same and then have a link -> " + linked);
        assert.ok(linked.match(/href=['"]http:\/\/knightlab.northwestern.edu['"]/), "should have an href -> " + linked);
        assert.ok(linked.match(/>knightlab.northwestern.edu<\/a>/), "should have an href " + linked);

        text = "This is some text with www.google.com in it";
        var linked = TL.Util.linkify(text);
        assert.ok(linked.startsWith('This is some text with <a'), "should start the same and then have a link " + linked);
        assert.ok(linked.match(/href=['"]http:\/\/www.google.com['"]/), "should have an href");
        assert.ok(linked.match(/>www.google.com<\/a>/), "should have the right link text");

        text = "This is some text with support@knightlab.zendesk.com in it";
        var linked = TL.Util.linkify(text);
        assert.ok(linked.startsWith('This is some text with <a'), "should start the same and then have a link " + linked);
        assert.ok(linked.match(/href=['"]mailto:support@knightlab.zendesk.com['"]/), "should have an href " + linked);
        assert.ok(linked.match(/>support@knightlab.zendesk.com<\/a>/), "should have the right link text " + linked);

        text = "This is text which already has <a href='http://google.com'>a link</a> in it."
        var not_linked = TL.Util.linkify(text);
        assert.equal(not_linked,text,'linkify should not have changed anything.')

        text = 'This is text which already has <a href="http://google.com">a link</a> in it.'
        var not_linked = TL.Util.linkify(text);
        assert.equal(not_linked,text,'linkify should not have changed anything.')

        text = 'This is text which already has <a href=http://google.com>a link</a> in it.'
        var not_linked = TL.Util.linkify(text);
        assert.equal(not_linked,text,'linkify should not have changed anything.')

      })

      QUnit.test("TL.Util.findNextGreater", function(assert) {
        var l = [1, 5, 10, 20, 35];
        assert.equal(TL.Util.findNextGreater(l,1),5, "5 is next greatest after 1");
        assert.equal(TL.Util.findNextGreater(l,5),10, "10 is next greatest after 5");
        assert.equal(TL.Util.findNextGreater(l,10),20, "20 is next greatest after 10");
        assert.equal(TL.Util.findNextGreater(l,15),20, "correctly handle a curr val which isn't in the list");
        assert.equal(TL.Util.findNextGreater(l,35),35, "handle value at end of list");
        assert.equal(TL.Util.findNextGreater(l,40),40, "handle value greater than max in list");
        assert.equal(TL.Util.findNextGreater(l,40, 35),35, "handle greater than max in list with default");

        assert.equal(TL.Util.findNextLesser(l,1),1, "1 is least");
        assert.equal(TL.Util.findNextLesser(l,5),1, "1 is least after 5");
        assert.equal(TL.Util.findNextLesser(l,10),5, "20 is next greatest after 10");
        assert.equal(TL.Util.findNextLesser(l,15),10, "10 is less than 15 (which isn't in list)");
        assert.equal(TL.Util.findNextLesser(l,35),20, "20 less than 35");
        assert.equal(TL.Util.findNextLesser(l,40),35, "35 is less than 40");
        assert.equal(TL.Util.findNextLesser(l,0, 0),0, "handle less than min in list without default");
        assert.equal(TL.Util.findNextLesser(l,0, -10),-10, "handle less than min in list with default");
      })

      QUnit.test("TL.Util.isEmptyObject", function(assert) {
          o = {}
          assert.ok(TL.Util.isEmptyObject(o),"no keys should be empty");
          o.foo = "  ";
          assert.ok(TL.Util.isEmptyObject(o),"empty string should be empty");
          o.bar = "";
          assert.ok(TL.Util.isEmptyObject(o),"2 empty strings should be empty");
          o.baz = null;
          assert.ok(TL.Util.isEmptyObject(o),"add null, still should be empty");
          o.foo = "  not empty  ";
          assert.equal(TL.Util.isEmptyObject(o), false, "adding a string ")
      })

      QUnit.test("TL.Util.parseYouTubeTime", function(assert) {
          assert.equal(TL.Util.parseYouTubeTime('5s'),5,"parse seconds only")
          assert.equal(TL.Util.parseYouTubeTime('1m5s'),65,"parse m/s")
          assert.equal(TL.Util.parseYouTubeTime('2h4m5s'),7445,"parse h/m/s")
          assert.equal(TL.Util.parseYouTubeTime('5m'),300,"parse minutes only")
          assert.equal(TL.Util.parseYouTubeTime('1h'),3600,"parse hours only")
          assert.equal(TL.Util.parseYouTubeTime(''),0,"handle empty string")
          assert.equal(TL.Util.parseYouTubeTime(null),0,"handle empty string")
          assert.equal(TL.Util.parseYouTubeTime('4:55'),0,"handle malformed string")
          assert.equal(TL.Util.parseYouTubeTime(5),5,"handle number")
      });

      QUnit.test("TL.Util.ensureUniqueKey", function(assert) {
          var o = { foo: 1, bar: 2 }
          assert.ok(!(TL.Util.ensureUniqueKey(o, 'foo') in o), "should be unique");
          assert.equal(TL.Util.ensureUniqueKey(o, 'baz'), 'baz', "not in there, give it back");
          assert.equal(TL.Util.ensureUniqueKey(o, 'foo'), 'foo-2', "treat existing as 1-based");
          o['foo-2'] = 3;
          assert.ok(!(TL.Util.ensureUniqueKey(o, 'foo') in o), "should be unique");
          var random = TL.Util.ensureUniqueKey(o, '');
          assert.ok(TL.Util.trim(random), "Should get a non-empty string");
          assert.ok(!(random in o), "empty string should get non-empty unique");
      });

 */


/* to port from unit-tests.html
    linkify
    findNextGreater
    isEmptyObject
    parseYouTubeTime
    ensureUniqueKey
    Date tests
    parseDate tests
    findBestFormat
    floor

*/