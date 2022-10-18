/*
    Determines the type of media the url string is.
    returns an object with .type and .id
    You can add new media types by adding a regex
    to match and the media class name to use to
    render the media

    The image_only parameter indicates that the
    call only wants an image-based media type
    that can be resolved to an image URL.
================================================== */

import Image from "./types/Image"
import YouTube from "./types/YouTube"
import GoogleMap from "./types/GoogleMap"
import Blockquote from "./types/Blockquote"
import Wikipedia from "./types/Wikipedia"
import SoundCloud from "./types/SoundCloud"
import Vimeo from "./types/Vimeo"
import DailyMotion from "./types/DailyMotion"
import Vine from "./types/Vine"
import Twitter from "./types/Twitter"
import TwitterEmbed from "./types/TwitterEmbed"
import Flickr from "./types/Flickr"
import DocumentCloud from "./types/DocumentCloud"
import Instagram from "./types/Instagram"
import Profile from "./types/Profile"
import GoogleDoc from "./types/GoogleDoc"
import Spotify from "./types/Spotify"
import IFrame from "./types/IFrame"
import Imgur from "./types/Imgur"
import PDF from "./types/PDF"
import Audio from "./types/Audio"
import Video from "./types/Video"
import Wistia from "./types/Wistia"

/**
 * Given a JavaScript Object for an event from a TimelineConfig,
 * determine the appropriate subclass of Media which can handle creating and showing an 
 * embed in the "media" section of that event's slide.
 *
 * When the `image_only` argument is true, the input `url_or_text` will only be
 * tested against patterns which are known to return images suitable for use as
 * thumbnails and backgrounds. Media classes returned when image_only is true should 
 * implement the getImageURL() function
 *
 * @param {Object} m
 * @param {Boolean} image_only
 * 
 * @returns {Object} a JS object which represents the match, including a `type`, `name`, 
 *                   `match_str`, and `cls`. These are all string values, except `cls`, which
 *                   is a JavaScript class which can be used to instantiate a media embed
 *                   or thumbnail.
 */

export function lookupMediaType(m, image_only) {
    var media = {},
        media_types = [{
                type: "youtube",
                name: "YouTube",
                match_str: "^(https?:)?\/*(www.)?youtube|youtu\.be",
                cls: YouTube
            },
            {
                type: "vimeo",
                name: "Vimeo",
                match_str: "^(https?:)?\/*(player.)?vimeo\.com",
                cls: Vimeo
            },
            {
                type: "dailymotion",
                name: "DailyMotion",
                match_str: "^(https?:)?\/*(www.)?dailymotion\.com",
                cls: DailyMotion
            },
            {
                type: "vine",
                name: "Vine",
                match_str: "^(https?:)?\/*(www.)?vine\.co",
                cls: Vine
            },
            {
                type: "soundcloud",
                name: "SoundCloud",
                match_str: "^(https?:)?\/*(player.)?soundcloud\.com",
                cls: SoundCloud
            },
            {
                type: "twitter",
                name: "Twitter",
                match_str: "^(https?:)?\/*(www.)?twitter\.com",
                cls: Twitter
            },
            {
                type: "twitterembed",
                name: "TwitterEmbed",
                match_str: "<blockquote class=['\"]twitter-tweet['\"]",
                cls: TwitterEmbed
            },
            {
                type: "googlemaps",
                name: "Google Map",
                match_str: /google.+?\/maps\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/search\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/place\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/dir\/([\w\W]+)\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)/,
                cls: GoogleMap
            },
            {
                type: "flickr",
                name: "Flickr",
                match_str: "^(https?:)?\/*(www.)?flickr.com\/photos",
                cls: Flickr
            },
            {
                type: "flickr",
                name: "Flickr",
                match_str: "^(https?:\/\/)?flic.kr\/.*",
                cls: Flickr
            },
            {
                type: "instagram",
                name: "Instagram",
                match_str: /^(https?:)?\/*(www.)?(instagr.am|^(https?:)?\/*(www.)?instagram.com)\/p\//,
                cls: Instagram
            },
            {
                type: "profile",
                name: "Profile",
                match_str: /^(https?:)?\/*(www.)?instagr.am\/[a-zA-Z0-9]{2,}|^(https?:)?\/*(www.)?instagram.com\/[a-zA-Z0-9]{2,}/,
                cls: Profile
            },
            {
                type: "documentcloud",
                name: "Document Cloud",
                match_str: /documentcloud.org\//,
                cls: DocumentCloud
            },
            {
                type: "image",
                name: "Image",
                match_str: /(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i,
                cls: Image
            },
            {
                type: "imgur",
                name: "Imgur",
                match_str: /^.*imgur.com\/.+$|<blockquote class=['\"]imgur-embed-pub['\"]/i,
                cls: Imgur
            },
            {
                type: "googledocs",
                name: "Google Doc",
                match_str: "^(https?:)?\/*[^.]*.google.com\/[^\/]*\/d\/[^\/]*\/[^\/]*\?usp=sharing|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*\&authuser=0|^(https?:)?\/\/*drive.google.com\/open\\?id=[^\&]*|^(https?:)?\/*[^.]*.googledrive.com\/host\/[^\/]*\/",
                cls: GoogleDoc
            },
            {
                type: "pdf",
                name: "PDF",
                match_str: /^.*\.pdf(\?.*)?(\#.*)?/,
                cls: PDF
            },
            {
                type: "wikipedia",
                name: "Wikipedia",
                match_str: "^(https?:)?\/*(www.)?wikipedia\.org|^(https?:)?\/*([a-z][a-z].)?wikipedia\.org",
                cls: Wikipedia
            },
            {
                type: "spotify",
                name: "spotify",
                match_str: "spotify",
                cls: Spotify
            },
            {
                type: "iframe",
                name: "iFrame",
                match_str: "iframe",
                cls: IFrame
            },
            {
                type: "blockquote",
                name: "Quote",
                match_str: "blockquote",
                cls: Blockquote
            },
            {
                type: "video",
                name: "Video",
                match_str: /(mp4|webm)(\?.*)?$/i,
                cls: Video
            },
            {
                type: "wistia",
                name: "Wistia",
                match_str: /https?:\/\/(.+)?(wistia\.com|wi\.st)\/.*/i,
                cls: Wistia
            },
            {
                type: "audio",
                name: "Audio",
                match_str: /(mp3|wav|m4a)(\?.*)?$/i,
                cls: Audio
            },
            {
                type: "imageblank",
                name: "Imageblank",
                match_str: "",
                cls: Image
            }
        ]

    if (image_only) {
        if (m instanceof Array) {
            return false;
        }
        for (var i = 0; i < media_types.length; i++) {
            switch (media_types[i].type) {
                case "flickr":
                case "image":
                case "instagram":
                    if (m.url.match(media_types[i].match_str)) {
                        media = media_types[i];
                        return media;
                    }
                    break;
                default:
                    break;
            }
        }

    } else {
        for (var i = 0; i < media_types.length; i++) {
            if (m.url.match(media_types[i].match_str)) {
                return media_types[i];
            }
        }
    }
    return false;
}