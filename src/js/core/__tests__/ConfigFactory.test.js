import { parseGoogleSpreadsheetURL, makeGoogleCSVURL } from "../ConfigFactory"

test("Bare sheet ID should come back in key", () => {
    var key = '1cWqQBZCkX9GpzFtxCWHoqFXCHg-ylTVUWlnrdYMzKUI';
    var parts = parseGoogleSpreadsheetURL(key);
    expect(parts.key).toBe(key)
})

test("new-ish url format should get the right key", () => {
    var url = 'https://docs.google.com/spreadsheets/d/1a8jYcSMWGXupicLJhtNAhkQfta8Fc5qKinDIJtroOAI/pubhtml'
    var key = '1a8jYcSMWGXupicLJhtNAhkQfta8Fc5qKinDIJtroOAI';
    var parts = parseGoogleSpreadsheetURL(url);

    expect(parts.key).toBe(key)

})
test("new-ish url format should get the right key and worksheet", () => {
    var url = 'https://docs.google.com/spreadsheets/d/1a8jYcSMWGXupicLJhtNAhkQfta8Fc5qKinDIJtroOAI/pubhtml?gid=2066744085'
    var key = '1a8jYcSMWGXupicLJhtNAhkQfta8Fc5qKinDIJtroOAI';
    var worksheet = '2066744085';
    var parts = parseGoogleSpreadsheetURL(url);
    expect(parts.key).toBe(key)
    expect(parts.worksheet).toBe(worksheet)
})

test("new-ish url format should get the right key", () => {
    var url = 'https://docs.google.com/spreadsheets/d/1_7l1RsxQIodkOuKguCPMVQWgmQLGoPr7nBQa9l1k5_4/pubhtml'
    var key = '1_7l1RsxQIodkOuKguCPMVQWgmQLGoPr7nBQa9l1k5_4';
    var parts = parseGoogleSpreadsheetURL(url);
    expect(parts.key).toBe(key)
})

describe("test making CSV URL from various inputs", () => {
    test("A 'd/' URL that's already right should work", () => {
        let test_url = 'https://docs.google.com/spreadsheets/u/1/d/1xuY4upIooEeszZ_lCmeNx24eSFWe0rHe9ZdqH2xqVNk/pub?output=csv'
        let parsed = new URL(makeGoogleCSVURL(test_url))
        let params = new URLSearchParams(parsed.search)
        expect(parsed.pathname).toMatch(/pub$/)
        expect(params.get('output')).toBe('csv')
    })

    test("a 'd/e' URL that's already right should work", () => {
        let test_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQI-XgDRVhy1z0CSrHAvYk_Nz_6agyJQQvCCdS_hN-Vco0mUG6zYRqu-ToLAfgVMlCRRxH3YthpDSTX/pub?output=csv'
        let parsed = new URL(makeGoogleCSVURL(test_url))
        let params = new URLSearchParams(parsed.search)
        expect(parsed.pathname).toMatch(/pub$/)
        expect(params.get('output')).toBe('csv')
    })

    test("A pubhtml Sheets URL should work", () => {
        let test_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSjoKQT3qQ8nWZw8bczMHrJdAnLN23WqifFrmZ-X5Bpt4P4uZK4Ebz3x3vA8Jok7u6NFi_yrrAnAccN/pubhtml?gid=0&single=true'
        let parsed = new URL(makeGoogleCSVURL(test_url))
        let params = new URLSearchParams(parsed.search)
        expect(parsed.pathname).toMatch(/pub$/)
        expect(params.get('output')).toBe('csv')
    })

    test("a non-Google Sheets URL should throw an exception", () => {
        expect(() => {
            makeGoogleCSVURL('https://docs.google.com/document/d/1qi4RH98Hce8jgH9rRXaOMBKNwfJ6LTgm0_10kPl-_WI/edit')
        }).toThrow()
    })

    expect(
        makeGoogleCSVURL('1xuY4upIooEeszZ_lCmeNx24eSFWe0rHe9ZdqH2xqVNk')
    ).toMatch(/pub\?output=csv$/)

})