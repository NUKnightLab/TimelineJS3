import { parseGoogleSpreadsheetURL } from "../ConfigFactory"

test("Bare sheet ID should come back in key", () => {
    var key = '1cWqQBZCkX9GpzFtxCWHoqFXCHg-ylTVUWlnrdYMzKUI';
    var parts = parseGoogleSpreadsheetURL(key);
    expect(parts.key).toBe(key)
})

test("new-ish url format should get the right key", ()=>{
    var url = 'https://docs.google.com/spreadsheets/d/1a8jYcSMWGXupicLJhtNAhkQfta8Fc5qKinDIJtroOAI/pubhtml'
    var key = '1a8jYcSMWGXupicLJhtNAhkQfta8Fc5qKinDIJtroOAI';
    var parts = parseGoogleSpreadsheetURL(url);

    expect(parts.key).toBe(key)

})
test("new-ish url format should get the right key and worksheet",() => {
    var url = 'https://docs.google.com/spreadsheets/d/1a8jYcSMWGXupicLJhtNAhkQfta8Fc5qKinDIJtroOAI/pubhtml?gid=2066744085'
    var key = '1a8jYcSMWGXupicLJhtNAhkQfta8Fc5qKinDIJtroOAI';
    var worksheet = '2066744085';
    var parts = parseGoogleSpreadsheetURL(url);
    expect(parts.key).toBe(key)
    expect(parts.worksheet).toBe(worksheet)
})

test("new-ish url format should get the right key",() => {
    var url = 'https://docs.google.com/spreadsheets/d/1_7l1RsxQIodkOuKguCPMVQWgmQLGoPr7nBQa9l1k5_4/pubhtml'
    var key = '1_7l1RsxQIodkOuKguCPMVQWgmQLGoPr7nBQa9l1k5_4';
    var parts = parseGoogleSpreadsheetURL(url);
    expect(parts.key).toBe(key)
})
