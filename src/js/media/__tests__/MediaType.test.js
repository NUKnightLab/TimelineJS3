import { lookupMediaType } from "../MediaType";
import { test, expect } from "@jest/globals"

const TEST_CASES = [
    // tuples: [URL, expected type, optional note which isn't used.]
    ['https://www.youtube.com/watch?v=pi2v1m6gmD8&t=5m21s', 'youtube', 'YouTube with time stamp'],
    ['//www.youtube.com/watch?v=pi2v1m6gmD8', 'youtube', 'YouTube with no protocol'],
    ['youtu.be/pi2v1m6gmD8', 'youtube', 'YouTu.be short url'],
    ['http://vimeo.com/20839673', 'vimeo'],
    ['http://www.dailymotion.com/video/x2fo0e8_the-history-of-advertising-in-60-seconds_lifestyle', 'dailymotion'],
    ['https://vine.co/v/Og5Ai71WHdD', 'vine'],
    ['https://soundcloud.com/usher-raymond-music/usher-i-dont-mind-feat-juicy-j', 'soundcloud'],
    ['https://twitter.com/NASASpaceflight/status/562327074384654336', 'twitter'],
    ['<blockquote class="twitter-tweet" lang="en"><p>Rough vs. smooth: the Anuket and Anubis regions on <a href="https://twitter.com/hashtag/67P?src=hash">#67P</a> <a href="http://t.co/kOyAiOKlma">http://t.co/kOyAiOKlma</a> <a href="https://twitter.com/hashtag/CometWatch?src=hash">#CometWatch</a> <a href="http://t.co/YmQ8bP5WbS">pic.twitter.com/YmQ8bP5WbS</a></p>&mdash; ESA Rosetta Mission (@ESA_Rosetta) <a href="https://twitter.com/ESA_Rosetta/status/563722810397560832">February 6, 2015</a></blockquote>', 'twitterembed'],
    ['https://www.google.com/maps/@42.032147,-87.6689625,15z', 'googlemaps', 'Google Maps with lat/long'],
    ['https://www.google.com/maps/search/target/@41.8747339,-87.6481257,13z?hl=en-US', 'googlemaps', 'Google Maps with search'],
    ['https://www.google.com/maps/place/Northwestern+University/@42.056459,-87.675267,17z/data=!3m1!4b1!4m2!3m1!1s0x880fd00b703e4c39:0x2c37b567fad56106', 'googlemaps', 'Google Maps with place'],
    ['https://www.google.com/maps/dir/W+Adams+St+%26+S+Clark+St,+Chicago,+IL/Northwestern+University,+633+Clark+Street,+Evanston,+IL+60208/@41.9672743,-87.7225481,12z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x880e2cbc8bcec53b:0x72d2c7372d97283d!2m2!1d-87.6308023!2d41.8794067!1m5!1m1!1s0x880fd00b703e4c39:0x2c37b567fad56106!2m2!1d-87.675267!2d42.056459', 'googlemaps', 'Google Maps with directions'],
    ['http://instagram.com/p/ymwL5JAsw5/', 'instagram'],
    ['http://instagram.com/lukerague/', 'profile'],
    ['https://www.flickr.com/photos/critterseeker/16420145375', 'flickr'],
    ['https://flic.kr/p/u7SSxw', 'flickr'],
    ['https://www.documentcloud.org/documents/1377371-folketinget.html', 'documentcloud'],
    ['http://www.kidzone.ws/images-changed/sharks/head.jpg', 'image', 'JPG'],
    ['http://usatlife.files.wordpress.com/2014/06/groundhog-day-bill-murray-winter-never-going-to-end.gif', 'image', 'GIF'],
    ['http://pngimg.com/upload/banana_PNG842.png', 'image', 'PNG'],
    ['http://upload.wikimedia.org/wikipedia/commons/c/c2/Rocky_Mountains.jpeg', 'image', 'JPEG'],
    ['https://docs.google.com/document/d/1RvKYxHuwweIP8zRrnjad-0exVoZOUsSVgDYPp0J1mzY/edit?usp=sharing', 'googledocs'],
    ['http://stlab.adobe.com/wiki/images/d/d3/Test.pdf', 'pdf'],
    ['https://en.wikipedia.org/wiki/1997_International_Tennis_Championships_%E2%80%93_Doubles', 'wikipedia'],
    ['<iframe src="https://embed.spotify.com/?uri=https://play.spotify.com/artist/2iE18Oxc8YSumAU232n4rW" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>', 'spotify', 'artist'],
    ['https://play.spotify.com/user/edvard_m/playlist/4xFSdiuP4gpR4wq2OghlOs', 'spotify', 'playlist'],
    ['https://play.spotify.com/track/5SdB3onMcO9ZBoKrdvCqhR', 'spotify', 'track'],
    ["<iframe src='https://cdn.knightlab.com/libs/timeline/latest/embed/index.html?source=10fFZXg4kioMz8uTVDZfawiJkgrWZxfJuziK1i1AaCrs&font=Bevan-PotanoSans&maptype=toner&lang=en&height=650' width='100%' height='650' frameborder='0'></iframe>", 'iframe'],
    ['<blockquote>This is a block quote.</blockquote>', 'blockquote'],
    ['http://2.bp.blogspot.com/-dxJbW0CG8Zs/TmkoMA5-cPI/AAAAAAAAAqw/fQpsz9GpFdo/s1600/voyage-dans-la-lune-1902-02-g.jpg', 'image'],
    ['https://de.wikipedia.org/wiki/Beryllium#/media/Datei:Beryl-Quartz-Emerald-Zambia-33mm_0885.jpg', 'wikipedia-image', 'regular wikipedia link'],
    ['https://commons.wikimedia.org/wiki/File:Hyperspace_Mountain_(27766070223).jpg', 'wikipedia-image', 'Wikimedia Commons link'],
    ['https://commons.wikimedia.org/wiki/Category:Airdancers#/media/File:Sky-dancer-japan.jpg', 'wikipedia-image', 'Wikimedia Commons link'],

]

test.each(TEST_CASES)("Ensure test URLs yield expected type", (url, expected_type) => {
    const result = lookupMediaType({ url: url })
    expect(result.type).toBe(expected_type)

})