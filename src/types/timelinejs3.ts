export namespace Props {
  export interface Date {
    /**
     * A number. Don't use commas. BCE years should be negative numbers.
     * Don't use the letters "BC", "BCE" or any others.
     */
    year: number
    /**
     * A number from 1-12 (Javascript experts don't outsmart yourselves:
     * Timeline corrects for Javascript's strange use of "0" for "January", etc.)
     */
    month?: number
    day?: number
    /**
     * A number from 0-23
     */
    hour?: number
    /**
     * A number from 0-59
     */
    minute?: number
    /**
     * A number from 0-59
     */
    second?: number
    millisecond?: number
    /**
     * A string for presenting the date. This value will be presented exactly as specified, overriding
     * TimelineJS's default date formatting. Note that the year property, at a minimum, must still be
     * provided so that TimelineJS can properly position the event on the actual timeline.
     */
    display_date?: string
    /**
     * A formatting string which will be used to render the date parts, if you wish to override
     * TimelineJS's default formatting. Note that in general you can achieve the same with display_date
     * (above), without needing to master the complexity of the date format strings.
     */
    format?: string
  }
  /**
   * Text objects are JSON objects with the following properties. For each slide, text objects are optional.
   */
  export interface Text {
    /**
     * Any text. HTML markup is OK. Blank is also OK.
     */
    headline?: string
    /**
     * Any text. HTML markup is OK. Blank is OK. Not used for era objects.
     */
    text?: string
  }
  /**
   * Media objects are JSON objects with the following properties. For each slide, media objects are optional.
   */
  export interface Media {
    /**
     * In most cases, a URL (see media type documentation for complete details).
     * {@see https://timeline.knightlab.com/docs/media-types.html}
     */
    url: string
    /**
     * Any text. HTML markup is OK. Blank is also OK.
     */
    caption?: string
    /**
     * Any text. HTML markup is OK. Blank is also OK.
     */
    credit?: string
    /**
     * A URL for an image to use in the timenav marker for this event. If omitted, Timeline will use an icon based
     * on the type of media. Not relevant for title slides, because they do not have a marker.
     */
    thumbnail?: string
    /**
     * An alt tag for your image. If none is provided, the caption, if any, will be used.
     */
    alt?: string
    /**
     * A title for your image. If none is provided, the caption, if any, will be used.
     */
    title?: string
    /**
     * Optional URL to use as the href for wrapping the media with an `<a>` tag.
     */
    link?: URL
    /**
     * Optional target to be associated with `link` if used.
     */
    link_target?: '_blank' | '_self'
  }
  export interface Slide {
    start_date: Date
    end_date?: Date
    /**
     * Not required, but recommended. Any text. HTML markup is OK. Blank is also OK.
     */
    text?: Text
    media?: Media
    /**
     * Any text. If present, Timeline will organize events with the same value for group to be in the same row
     * or adjacent rows, separate from events in other groups. The common value for the group will be shown as
     * a label at the left edge of the navigation.
     */
    group?: string
    /**
     * A string which will be used when Timeline displays the date for this. If used, override's display_date
     * values set on the start or end date for this event, which is useful if you want to control how the two
     * dates relate to each other.
     */
    display_date?: string
    background?: {
      /**
       * The fully-qualified URL pointing to an image which will be used as the background for the event.
       */
      url?: string
      /**
       * Alternative text that describes the image provided by the url property
       */
      alt?: string
      /**
       * A CSS color, in hexadecimal (e.g. #0f9bd1) or a valid CSS color keyword.
       * {@see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords}
       */
      color?: string
    }
    /**
     * A boolean value (true or false). Defaults to true, which means that Timeline will scan text fields
     * and automatically add <a> tags so that links and email addresses are "clickable." If set to false,
     * you may still manually apply the tags in the appropriate fields when you want links. Autolinking applies
     * to the text field in a text object and the caption and credit fields in a media object.
     */
    autolink?: boolean
    /**
     * A string value which is unique among all slides in your timeline. If not specified, TimelineJS will construct
     * an ID based on the headline, but if you later edit your headline, the ID will change. Unique IDs are used when
     * the hash_bookmark option is used, and can also be used with the timeline.goToId() method to programmatically
     * move the timeline to a specific slide.
     */
    unique_id?: string
  }
  /**
   * Era objects are JSON objects which are used to label a span of time on the timeline navigation component.
   * In structure, they are essentially very restricted "slide" objects.
   */
  export interface Era {
    start_date: Date
    end_date: Date
    /**
     * Not required, but recommended. Any text. HTML markup is OK. Blank is also OK.
     */
    text?: Omit<Text, 'text'>
  }

  export interface Data {
    events: Slide[]
    title?: Slide
    eras?: Era[]
    /**
     * Either human or cosmological. If no scale is specified, the default is human. The cosmological scale is
     * required to handle dates in the very distant past or future. (Before Tuesday, April 20th, 271,821 BCE
     * after Saturday, September 13 275,760 CE) For the cosmological scale, only the year is considered, but it's
     * OK to have a cosmological timeline with years between 271,821 BCE and 275,760 CE.
     */
    scale?: 'human' | 'cosmological' // default is "human"
  }

  /**
   * When you create a timeline manually by calling TL.Timeline, you may pass in an optional third parameter which
   * contains a variety of presentation options. This third parameter should be a Javascript object with keys matching
   * the value in the Name column and corresponding values appropriate to the specific key.
   * {@example
   * ```js
   * const options = {
   *   hash_bookmark: false,
   *   initial_zoom: 5,
   * }
   * const timeline = new TL.Timeline('timeline-embed',
   *   'https://docs.google.com/spreadsheets/d/1cWqQBZCkX9GpzFtxCWHoqFXCHg-ylTVUWlnrdYMzKUI/pubhtml',
   *   options)
   * ```
   * }
   *
   * If you use our authoring tool, you can pass most of these as URL parameters. Add &option_name=value for each.
   * To demonstrate using the same options as above:
   * https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1cWqQBZCkX9GpzFtxCWHoqFXCHg-ylTVUWlnrdYMzKUI&font=Default&lang=en&initial_zoom=3&height=650&hash_bookmark=false
   */
  export interface Options {
    /**
     * default is `"default"`
     *
     * May be one of a list of Timeline's "built-in" font sets, or a full or relative URL (ending in .css) which
     * points to a CSS file in the same format as the built-ins. (See the typography section of "Overriding
     * Timeline's Styles")
     * {@see https://timeline.knightlab.com/docs/overriding-styles.html#typography}
     * The valid values for the built-in fonts are:
     * `
     * abril-droidsans
     * amatic-andika
     * bevan-pontanosans
     * bitter-raleway
     * clicker-garamond
     * dancing-ledger
     * default
     * fjalla-average
     * georgia-helvetica
     * lustria-lato
     * medula-lato
     * oldstandard
     * opensans-gentiumbook
     * playfair-faunaone
     * playfair
     * pt
     * roboto-megrim
     * rufina-sintony
     * ubuntu
     * unicaone-vollkorn
     * `
     */
    font?: 'default' | string
    /**
     * default is `false`
     *
     * If true, copious console logging will be enabled.
     */
    debug?: boolean
    /**
     * `this._el.container.offsetHeight`
     *
     * The height of the timeline.
     */
    height?: number
    /**
     * `this._el.container.offsetWidth`
     *
     * The width of the timeline.
     */
    width?: number
    /**
     * default is `false`
     *
     * If `true`, the class `tl-timeline-embed` is added to the outer Timeline container. Typically only used to
     * support Timeline iframe embeds.
     */
    is_embed?: boolean
    /**
     * default is `false`
     *
     * If set to `true`, TimelineJS will update the browser URL each time a slide advances, so that people can
     * link directly to specific slides.
     */
    hash_bookmark?: boolean
    /**
     * default is `"white"`
     *
     * RGB values to use for slide backgrounds. Specify as hex code, CSS named color, or a Javascript object
     * with `r`, `g`, and `b` properties from 0-255.
     */
    default_bg_color?: string
    /**
     * default is `2`
     *
     * How many screen widths wide the timeline should be at first presentation.
     */
    scale_factor?: number
    /**
     * The position in the `zoom_sequence` series used to scale the Timeline when it is first created. Takes
     * precedence over `scale_factor`.
     */
    initial_zoom?: number
    /**
     * default is `[0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]`
     *
     * Array of values for TimeNav zoom levels. Each value is a `scale_factor`, which means that at any given
     * level, the full timeline would require that many screens to display all events.
     */
    zoom_sequence?: number[]
    /**
     * default is `"bottom"`
     *
     * Display the timeline nav on the `top` or `bottom`.
     */
    timenav_position?: 'top' | 'bottom'
    /**
     * default is `100`
     *
     * Optimal distance (in pixels) between ticks on axis.
     */
    optimal_tick_width?: number
    /**
     * default is `"tl-timeline"`
     *
     * Removing the `tl-timeline` base class will disable all default stylesheets.
     */
    base_class?: string
    /**
     * default is `150`
     *
     * The height in pixels of the timeline nav. Takes precedence over timenav_height_percentage.
     */
    timenav_height?: number
    /**
     * default is `25`
     *
     * Specify the timeline nav height as a percentage of the screen instead of in pixels.
     */
    timenav_height_percentage?: number
    /**
     * default is `40`
     *
     * Specify the timeline nav height as a percentage of a mobile device screen.
     */
    timenav_mobile_height_percentage?: number
    /**
     * default is `150`
     *
     * The minimum timeline nav height (in pixels).
     */
    timenav_height_min?: number
    /**
     * default is `30`
     *
     * The minimum marker height (in pixels).
     */
    marker_height_min?: number
    /**
     * default is `100`
     *
     * The minimum marker witdh (in pixels).
     */
    marker_width_min?: number
    /**
     * default is `5`
     *
     * Top and bottom padding (in pixels) for markers.
     */
    marker_padding?: number
    /**
     * default is `0`
     *
     * The first slide to display when the timeline is loaded.
     */
    start_at_slide?: number
    /**
     * default is `false`
     * If true, loads timeline on last slide.
     */
    start_at_end?: boolean
    /**
     * default is `0`
     */
    menubar_height?: number
    /**
     * default is `false`
     *
     * Use declared suffix on dates earlier than 0.
     */
    use_bc?: boolean
    /**
     * default is `1000`
     *
     * Animation duration (in milliseconds).
     */
    duration?: number
    /**
     * default is `TL.Ease.easeInOutQuint`
     */
    ease?: string
    /**
     * default is `true`
     */
    dragging?: boolean
    /**
     * default is `true`
     */
    trackResize?: boolean
    /**
     * default is `100`
     *
     * Padding (in pixels) on the left and right of each slide.
     */
    slide_padding_lr?: number
    /**
     * default is `"0%"`
     */
    slide_default_fade?: string
    /**
     * default is `"en"`
     *
     * Value should be a language code for a translation set included with TimelineJS. See the
     * Github repository for the set of supported language codes—to use these, specify the
     * filename without the `.json` extension.
     * {@see https://github.com/NUKnightLab/TimelineJS3/tree/master/src/js/language/locale}
     *
     * Alternatively, you can create your own translation file, for other languages or simply
     * to override the default messages. To do this, specify a URL to a file based on `en.json`.
     * Your URL must end in `.json`.
     */
    language?: string
    /**
     * default is `null`
     *
     * Google Analytics ID.
     */
    ga_property_id?: string
    /**
     * default is `['back_to_start', 'nav_next', 'nav_previous', 'zoom_in', 'zoom_out']`
     */
    track_events?: string[]
    /**
     * default is `""`
     *
     * Can be used to help Timeline load related resources such as CSS themes and language files.
     * Rarely needs to be set, except if you are bundling the TimelineJS javascript code with other
     * javascript, so that the script it load from isn't in the same "relative" location to your
     * local copy of those resources.
     */
    script_path?: string
    /**
     * default is `false`
     *
     * If this option is set to true, then TimelineJS will load the code necessary to support clips
     * created using Knight Lab's SoundciteJS. This eliminates the need to add the embed code shown
     * in step 3 of the Soundcite authoring tool. Simply copy the per-clip markup from step 2 into
     * the "text" field for any TimelineJS event.
     *
     * Note that while the default value for this option is false, for timelines hosted on Knight
     * Lab's systems, the value is set to true for ease of use.
     */
    soundcite?: boolean
  }
}
