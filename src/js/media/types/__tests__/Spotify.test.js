import { computeMediaId } from "../Spotify"

test("Test Spotify album URI parsing", () => {
    expect(computeMediaId('spotify:album:2pjw16J7dxC2OxE9IXx3ap')).toBe('spotify:album:2pjw16J7dxC2OxE9IXx3ap')
})

test("Test Spotify track URI parsing", () => {
    expect(computeMediaId('spotify:track:6ODEZhveop56v8iIAn4d37')).toBe('spotify:track:6ODEZhveop56v8iIAn4d37')
})

test("Test Spotify playlist URI parsing", () => {
    expect(computeMediaId('spotify:playlist:3m1B9QuJCzMyaZ5ZNcZHcU')).toBe('spotify:playlist:3m1B9QuJCzMyaZ5ZNcZHcU')
})

test("Test Spotify Podcast (show) URI parsing", () => {
    expect(computeMediaId('spotify:show:6X0ThBWpiPUplNxoaa7SMx')).toBe('spotify:show:6X0ThBWpiPUplNxoaa7SMx')
})

test("Test Spotify Podcast (show) URL parsing", () => {
    expect(computeMediaId('https://open.spotify.com/show/10lMwCjvzLCLwth2AW6cLG?si=Q4SrdpUqR0y760-YPae5eQ')).toBe('spotify:show:10lMwCjvzLCLwth2AW6cLG')
})

test("Test Spotify Podcast episode URI parsing", () => {
    expect(computeMediaId('spotify:episode:4ZtiBm7sOfHxmcyKiFk3Du')).toBe('spotify:episode:4ZtiBm7sOfHxmcyKiFk3Du')
})

test("Test Spotify Podcast episode URL parsing", () => {
    expect(computeMediaId('https://open.spotify.com/episode/3YfwPP44f8gkKzQ0FaKPhV?si=B_qJ0-VESC-wR56Oxg_izg')).toBe('spotify:episode:3YfwPP44f8gkKzQ0FaKPhV')
})




test("Test Spotify track URL parsing", () => {
    expect(computeMediaId('https://open.spotify.com/track/42tWihPxkddkM9uSKmRE8e?si=1DbU8tkITiOtPfz6jw052g')).toBe('spotify:track:42tWihPxkddkM9uSKmRE8e')
})

test("Test Spotify playlist URL parsing", () => {
    expect(computeMediaId('https://open.spotify.com/playlist/3n6LGHL5YDCkcEl4skWNSx?si=J3tnEbJ8R3-g7pilNHfT3g')).toBe('spotify:playlist:3n6LGHL5YDCkcEl4skWNSx')
})