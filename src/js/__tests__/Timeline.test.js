import { Timeline } from "../timeline/Timeline"

const TEST_CONFIG = {
    "title": {
        "media": {
            "url": "http://www.germuska.com/salzburg-album/full/2QVB_022.jpg",
            "caption": "The secret passage at Schloss Leopoldskron, Salzburg, Austria",
            "credit": "Joe Germuska"
        },
        "text": {
            "headline": "TimelineJS Media Types",
            "text": "<p>TimelineJS supports many media types. This provides a simple way to test them all. This page tests a simple image on a remote server.</p>"
        }
    },
    "events": [{
            "id": "youtube",
            "media": {
                "url": "https://www.youtube.com/watch?v=pi2v1m6gmD8&t=5m21s",
                "caption": "the Monkey section of David Van Tieghem's <em>Ear Drums</em>"
            },
            "start_date": {
                "year": "1901"
            },
            "text": {
                "headline": "YouTube Videos",
                "text": "<p>if Timeline finds a URL that starts with 'youtube.com' or 'youtu.be', it will try to use it to embed a YouTube video. The <em>protocol</em> part of the URL (e.g. <em>https://</em>) is technically optional.</p><p>You can start at a specific point in the video using the <code>t=#m#s</code> parameter: see <a href='http://youtubetime.com/'>http://youtubetime.com/</a></p>"
            }
        },
        {
            "id": "vimeo",
            "media": {
                "url": "http://vimeo.com/20839673",
                "caption": "<em>Phat Tai</em>, a story of Vietnamese fishermen on the Gulf Coast.",
                "credit": "Joe York/Southern Foodways Alliance"
            },
            "start_date": {
                "year": "1902"
            },
            "text": {
                "headline": "Vimeo",
                "text": "To embed a Vimeo video, just copy the URL of the Vimeo.com page which shows the video."
            }
        }
    ]
}

beforeEach(() => {
    // Set up our document body
    document.body.innerHTML =
        '<div id="timeline-embed"></div>';
})

// these tests fail because the timeline config instantiation is async, and the test
// proceeds before it's ready. I still haven't figured out how to make Jest wait
// until it's actually ready, or maybe there's a different problem?
test("Ensure options is optional", async() => {
    let timeline = await new Promise((resolve) => {
        let tl = new Timeline('timeline-embed', TEST_CONFIG)
        debugger
        tl.on('ready', () => resolve(tl))
    });
    // these tests will fail until we figure out how to deal with
    // the fact that the config creation/setting is async
    // tried some things waiting for 
    expect(timeline.config).toBeDefined()
})

// these tests fail because the timeline config instantiation is async, and the test
// proceeds before it's ready. I still haven't figured out how to make Jest wait
// until it's actually ready, or maybe there's a different problem?
test("test remove", () => {
    let timeline = new Timeline('timeline-embed',
        TEST_CONFIG, { // i don't think this is actually used?
            script_path: 'http://localhost:1234/'
        });
    expect(timeline.config).toBeDefined()
    expect(timeline.config.events.length).toBe(2)
    expect(timeline.config.event_dict['vimeo']).toBeTruthy()
    timeline.removeId('vimeo')
    expect(timeline.config.events.length).toBe(1)
    expect(timeline.config.event_dict['vimeo']).toBeFalsy()
})