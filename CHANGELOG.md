3.8.22 (Not yet released)
-------------------------
* A bounty of accessibility improvements contributed by @OleksandrDanylchenko:
    * #744 Contrast improvements
    * #747 Reading order improvements for better screen reader experience
    * #749 Render left/right arrows as button tags for better accessibility
    * #750 Prevent focus on non-visible but tabbable elements
    * #756 Focus on parent on slide change for better tab navigation
    * #758 Render menu bar (zoom and back-to-start) as button tags for better accessibility
    * #760 Introduce ARIA regions to Timeline
    * #764 Improved tabbing order of the Timeline component
    * #766 Improved keyboard navigation of Timeline navigation element
    * #768 Accessibility improvements for TimeMarkers
    * #770 Add state-based aria labels to zoom in/out to explain their effects
    


3.8.21 (2022-04-29)
------------------
* #704 honor "start_at_end" option when also using "hash_bookmark" option
* #730 Improved Norwegian translations for both bøkmal and nynorsk.
* #710 Improve tests by setting timezone (and adjusting the async handling in `Timeline.test.js`)

3.8.20 (2022-02-16)
------------------
* #719 - Support Dropbox URL rewriting for audio and video as well as images. Thanks @Simonkcaon !

3.8.19 (2022-01-07)
------------------
* #724 - Alternate syntax for compatibility with Vite, probably other tooling.

3.8.18 (2021-06-08)
------------------
* #699 - remove duplicate definition of _onStorySliderLoaded in Timeline.js
* #700 - remove duplicate definition of _onTimeNavLoaded in Timeline.js
* #705 - Export Timeline class and include generated CSS in npm package

3.8.17 (2021-04-19)
------------------
* #696 - implement pause on audio/video media types
* Add support for direct webm video URLs
* Update several npm dependencies

3.8.16 (2021-04-02)
------------------
* Add hash change listener so that timelines with `hash_bookmark` option respond to hash changes after loading. (#692)

3.8.15 (2021-02-17)
------------------
* Fix straggling JSON syntax error in en.json example file.
* Fix bug introduced with cosmological date formatting to do with inconsistencies between Language.js and en.json

3.8.14 (2021-02-14)
------------------
* Make en.json proper JSON (remove comments) now that new codepath is causing it to be DOMContentLoaded
* Add better error handling to Net.js just in case.
* Resolve not to release code on Friday afternoon

3.8.13 (2021-02-12)
------------------
* #682: adjust language loading to make sure its done before drawing timeline.

3.8.12 (2021-01-25)
------------------
* #363,670: remove synchronous XMLHttpRequests
* #672: support Spotify podcasts
* #649: better handling of a/href tags to open in new windows, or to follow specified target values

3.8.11 (2020-11-23)
------------------
* Improve error messaging re issues retrieving configuration data from Google.

3.8.10 (2020-11-03)
------------------
* Change Instagram handling to catch up to their API changes. (#664)

3.8.9 (2020-10-23)
------------------
* Fix pattern matching and URL parsing for using Google Drive documents.
* Adjust rules for loading font to support relative/fragment URLs for `font` config option

3.8.8 (2020-10-20)
------------------
* fix error in TL.lookupMediaType  

3.8.7 (2020-10-20) INVALID RELEASE DO NOT USE
------------------
* clearer error messaging if time is used without date
* strip all whitespace from both ends of header cells
* expose TL.lookupMediaType as a publicly accessible function (formerly TL.MediaType before 3.7.0)

3.8.6 (2020-09-29)
------------------
* #659: Prevent blank column headers from derailing Timeline load

3.8.5 (2020-09-28)
------------------
* check for null when validating date inputs from CSV

3.8.4 (2020-09-28)
------------------
* #655: treat all-whitespace Google Sheets values as blank and don't try to process them
* #656: chomp excess whitespace around header values/object keys.
* #658: clean integer values for dates -- strip whitespace and comma

3.8.3 (2020-09-25)
------------------
* Make CSV parser always return strings (fixes bug where V1 Sheets with year-only dates were assumed to be strings)
* Log instead of throw error when trying to add an event in TimelineConfig that has no start date

3.8.2 (2020-09-25)
------------------
* Fix a bug in ConfigFactory date processing which was adding unintended "January 1, 0" end dates.

3.8.1 (2020-09-23)
------------------
* Change Timeline's Google Sheets access method in advance of the discontinuation of Google Sheets API v3. See https://knightlab.northwestern.edu/2020/09/16/timelinejs-update-2/index.html for more information. All self-hosted timeline users should update to this version before 2020-09-30.

3.8.0 (2020-09-23)
------------------
* Discarded release: failed to merge key changes into master branch.

3.7.9 (2020-09-17)
------------------
* #654: Attempt to avoid 'overlapping' slides. Mixed feedback on if this is a complete solution.

3.7.8 (2020-09-02)
------------------
* #651: Restore document loading check with proper binding

3.7.7 (2020-08-26)
------------------
* #651: rollback document loading check after error reports

3.7.6 (2020-08-25)
------------------
* Add a check of the document's loading status, and defer layout until DOMContentLoaded, in response to reports of timelines where all slide content overlaps.
* Introduce a 'ready' event, which TimelineJS will fire after all other initialization is complete.
* Support a Timeline option, `soundcite`, which triggers the loading of Knight Lab's SoundciteJS code, enabling the use of SoundCite markup in all HTML-capable Timeline fields.
* Fix error messages in Imgur media type

3.7.5 (2020-07-22)
------------------
* More fixes to handling default font case
* add missing import for Wistia media type

3.7.4 (2020-07-21)
------------------
* Fix #645: restore removeId to public API for a Timeline
* Fix: only load font.default.css when no other font is specified; otherwise
       cascade rules are inconsistent with old behavior.

3.7.3 (2020-07-16)
------------------
* Fix stupid bugs introduced with incomplete testing.

3.7.2 (2020-07-16)
------------------
* Fix variable naming error when handling thrown exceptions in adding eras
* Fix name of div in developer "embed" template to restore ability to switch data source for dev view
* don't routinely sanitize media URLs; instead, place that responsibility on Media subclasses for which the 'url' is actually used with markup

3.7.1 (2020-07-10)
------------------
* Protect against undefined/null options in constructor
* Pass a valid message container for 'swipe to navigate' #644

3.7.0 (2020-07-09)
------------------
* Internal rewrite to use modern JavaScript
* Sanitize HTML inputs

3.6.6 (2020-03-11)
------------------
* Replace Flickr API key

3.6.5 (2019-05-01)
------------------
* Revert construction of Google feeds URL to pre-3.6.4 pattern which should be more universally correct.

3.6.4 (2019-04-30)
------------------
* Fall back to Google Sheets API v4 when 500 error found using v3 (Workaround for Google API failure)
* Issue #598 - use 24-hr time for Portuguese
* PR #599 allow text selection on all devices
* PR #608 allow video start times (and end times for youtube)
* PR #609 fixes #577 link hover on slides w/ background images

3.6.2 (2018-12-20)
------------------
* PR #592 adds missing woff2 font to fix nav arrows on MS Edge
* PR #594 Updated Czech (Čeština) translations

3.6.1 (2018-10-10)
------------------
* Correct translation of "July" in Slovenian.

3.6.0 (2018-06-11)
------------------
* Configure Google Analytics tracking to anonymize_ip for GDPR compliance

3.5.4 (2017-12-15)
------------------
* PR #331 fixes bug that was causing duplications of groups
* Fix to allow missing media in JSON #565

3.5.3 (2017-11-07)
------------------
* Remove 1px offset that causes white line along top of Timeline

3.5.2 (2017-10-26)
------------------
* PR #554 adds direction to .tl-rtl

3.5.1 (2017-05-03)
------------------
* PR #522 use https in wistia

3.5.0 (2017-05-03)
------------------
* PR #510 Twitter image support
* PR #520, #515 Imgur image support
* PR #514 Wistia video support (URL only)
* PR #508 Fixes to local previews for development

3.4.9 (2017-04-10)
------------------
------------------
* PR #468 support audio and video files (.mp4, .mp3, .wav, .m4a)
* PR #460 improve spotify documentation and support album and artist pages
* PR #454 use the `lang` attribute set in the embed url as the lang for the iframe
* PR #453 add support for title and alt tags on images

3.4.8 (2017-03-31)
------------------
------------------
* Fix missing accent in French translation
* Add additional Thai translation

3.4.7 (2016-01-12)
------------------
* PR #447 Enable Vimeo fullscreen controls

3.4.6 (2016-12-12)
------------------
* Revert PR #387 which was causing slide cutoff on small screens

3.4.5 (2016-12-07)
------------------
* PR #428 - Reinstate table display for IE. #427

3.4.3 (2016-11-15)
------------------
* Revert PR #374, reopen #277. Fix left black bar across full screen timelines.

3.4.2 (2016-11-15)
------------------
* PR #374 - Adds margin-top for large screen disply. Fixes #277
* PR #401 - Adds Vietnamese translation
* PR #419 - Removes year zero from the timeline. Fixes #328
* PR #387 - Fixes background image scrolling on long slide. #360
* PR #389 - Adds YouTube end-time feature. #388

3.4.1 (2016-10-04)
------------------
* PR #400 - pause Vine, DailyMotion, and Soundcloud media on slide exit (thanks @Hammman and @JustaBitDope)
* PR #413 - French language support additions

3.4.0 (2016-08-30)
-------------------
* Complete (?) RTL language support, removed Urdu Unicode translation bugs

3.3.17 (2016-08-22)
-------------------
* #372 Italian translation for "Swipe to Navigate"
* #376 Throw an error if URL is neither a Google Spreadsheet nor a source of parseable JSON
* Chinese (traditional) (zh-cn) translation for "Swipe to Navigate"
* Norwegian translation for "Swipe to Navigate"
* added Burmese translation

3.3.16 (2016-05-31)
-------------------
* #365 Scope vcard styles to avoid impacting pages which embed timelines without iframe
* #366 Fix headline problem with <p> tag

3.3.15 (2016-05-11)
-------------------
* Apply MediaType handling to thumbnails for the slider, so that people can use the same kinds of urls they use for regular media.
* Establish correct indication of "BCE" in Swedish.
* Establish correct indication of "BYA" abbreviations in Finnish and Hungarian.

3.3.14 (2016-03-22)
-------------------
* Fix bug in handling imgur URLs which were to an imgur page and not directly to an image.

3.3.13 (2016-02-25)
-------------------
* Fix API calls for Soundcloud, DailyMotion, Instagram, Spotify and Vine which used http and thus would fail in cross-protocol situations.
* #342 test for 'start at end' to support boolean true as well as 'true'
* #340 docfix: syntax highlighting for code snippets on GitHub Markdown
* #323 more careful for loop in case people extend the Array prototype; fix build problem for Linux user-select

3.3.12 (2016-02-01)
-------------------
* translate "swipe_to_navigate" for German (de)
* add Urdu (ur) translation

3.3.11 (2015-12-03)
-------------------
* back out header validation, interfered with too many random changes in the wild

3.3.10 (2015-12-02)
-------------------
* improved validation/messaging during authoring: changes to headers, eras without end dates (#287)
* Improved support for PDF files from Dropbox

3.3.9 (2015-10-26)
----------------------
* Make sure 'invalid_date_err' gets translated, esp so detail message gets displayed

3.3.8 (2015-10-20)
----------------------
* Fix Document Cloud URL bug

3.3.7 (2015-10-19)
----------------------
* Fix bug in Twitter embed (#282) (thanks @Newman101)
* Support media-type image inference for background images (eg flickr, imgur, dropbox) (#268)

3.3.6 (2015-10-12)
------------------
* Have TimelineConfig validate date parts as integers (#269)
* Support Twitter embed markup in media (in addition to a direct URL to a tweet)
* support flic.kr URLs for Flickr images in addition fo flickr.com
* add Imgur to supported media types
* don't duplicate tl-storyslider class (#223)
* Improved support for error message I18N

3.3.5 (2015-10-01)
------------------
* remove default target for links added by code.

3.3.4 (2015-09-30)
------------------
* implement PDF media type (#205)

3.3.3 (2015-09-30)
------------------
* Fix small offset in marker group alignment (#259)
* Fix text-shadow appearing on slides with backgrounds (#260)
* Added Bevan-PontanoSans font combo
* Support for IE9 officially ruled out
* Fixes to blockquote style
* default TL.debug to false.

3.3.2 (2015-09-23)
------------------
This version of Timeline officially replaces the previous one.
