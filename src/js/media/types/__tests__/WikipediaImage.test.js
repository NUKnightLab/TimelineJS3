import { computeMediaId, processImageInfoAPIJSON } from "../WikipediaImage"
import { test, expect } from "@jest/globals"

const TEST_CASES = [
    ['https://commons.wikimedia.org/wiki/https://commons.wikimedia.org/wiki/File:Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg', 'File:Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg'],
    ['https://en.wikipedia.org/wiki/Main_Page#/media/File:Symphyotrichum_kentuckiense_233619783_(inflor).jpg', 'File:Symphyotrichum_kentuckiense_233619783_(inflor).jpg'],
    ['https://es.wikipedia.org/wiki/Portal:M%C3%BAsica#/media/Archivo:David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg', 'File:David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg'],
    ['https://commons.wikimedia.org/wiki/Category:Airdancers#/media/File:Sky-dancer-japan.jpg', 'File:Sky-dancer-japan.jpg']
]

const IMAGE_INFO_JSON_RESPONSE = {
    "batchcomplete": "",
    "query": {
        "normalized": [{
            "from": "File:Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg",
            "to": "File:Beryl-Quartz-Emerald-Zambia-33mm 0885.jpg"
        }],
        "pages": {
            "10450749": {
                "pageid": 10450749,
                "ns": 6,
                "title": "File:Beryl-Quartz-Emerald-Zambia-33mm 0885.jpg",
                "imagerepository": "local",
                "imageinfo": [{
                    "thumburl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg/100px-Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg",
                    "thumbwidth": 100,
                    "thumbheight": 121,
                    "thumbmime": "image/jpeg",
                    "responsiveUrls": { "1.5": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg/150px-Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg", "2": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg/200px-Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg" },
                    "url": "https://upload.wikimedia.org/wikipedia/commons/d/df/Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg",
                    "descriptionurl": "https://commons.wikimedia.org/wiki/File:Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg",
                    "descriptionshorturl": "https://commons.wikimedia.org/w/index.php?curid=10450749",
                    "mime": "image/jpeg"
                }]
            }
        }
    }
}

test.each(TEST_CASES)("Ensure correct file identifier is extracted", (url, file_id) =>
    expect(computeMediaId(url)).toBe(file_id)
)

test("get image info data", () => {
    let response = processImageInfoAPIJSON(IMAGE_INFO_JSON_RESPONSE)
    expect(response.url).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg/100px-Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg")
    expect(response.page_id).toBe("10450749")
})