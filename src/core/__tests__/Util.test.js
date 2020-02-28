import { hexToRgb, maxDepth, trim } from "../Util";

test("hexToRgb", () => {
    expect(hexToRgb("#000000")).toMatchObject({ r: 0, g: 0, b: 0 });    
} )

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
