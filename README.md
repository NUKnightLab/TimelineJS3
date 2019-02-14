TimelineJS3
============

TimelineJS v3: A Storytelling Timeline built in JavaScript.  https://timeline.knightlab.com

## Overview

TimelineJS 3 is a rewrite of the popular Timeline JS software. Please be clear that this is software which "does" the same thing, but it isn't the same software, so some details will vary. See https://timeline.knightlab.com for more information.

## Contributing to TimelineJS
Are you trying to contribute to or develop TimelineJS3? [Here's where you should start.](https://github.com/NUKnightLab/TimelineJS3/blob/master/CONTRIBUTING.md)

## Getting Started

The [official documentation for embedding a Timeline in your page instead of using an embed](https://timeline.knightlab.com/docs/instantiate-a-timeline.html) is now maintained on the main TimelineJS website.


## Options

The [official documentation for configuration options](https://timeline.knightlab.com/docs/options.html) is now maintained on the main TimelineJS website.


## Data file
The [official documentation for the JSON format](https://timeline.knightlab.com/docs/json-format.html) is now maintained on the main TimelineJS website.


## API
See API doc here: https://github.com/NUKnightLab/TimelineJS3/blob/master/API.md

## Media Types

The [official documentation for available media types](https://timeline.knightlab.com/docs/media-types.html) is now maintained on the main TimelineJS website.



### Extending Media Types
* Create a new class for the media type in `source/js/media/type`. It's easiest to duplicate an existing one and change the filename and classname.
* Add the new file to the code-kit compile list inside the main `TL.Timeline.js` file. Code-kit uses the following language to prepend the file to the compile `// @codekit-prepend "media/types/TL.Media.YourMediaTypeName.js";`
* Add a new object to the `media_types` array in `source/js/media/TL.MediaType.js`. Make sure to have the correct class name in `cls` and use `match_str` as a regex to help timeline figure out what type of media the given url is.
* If you want icons for the media to show up in the Timeline, then you will also need to add an icon class to `source/less/icons/Icons.less` that has the name `.tl-icon-yourmediatypename`.
