#TimelineJS3 API

### Events

`back_to_start`

There is a `back_to_start` event fired when the user clicks to control to return to the beginning of the timeline.  The event data contains the id of the new current slide.

`change`

There is a `change` event fired when the current slide changes.  The event data contains the id of the new current slide.  Maybe change this so that the event data consists for the previous and current slide index and/or ids.  

### Control

####Existing functions

`Timeline.goTo(n)`

Go to the slide at index `n`.

`Timeline.goToId(n)`

Go to the slide with id `n`.

####Suggested functions

`Timeline.goToNext()`

Go to the next slide

`Timeline.goToPrev()`

Go to the previous slide

`Timeline.goToStart()`

Go to the first slide

`Timeline.goToEnd()`

Go to the last slide

`Timeline.goToTitle()`

This was mentioned, but I don't really know if this makes sense  unless there is always only one title slide.

`Timeline.addSlide(data, n)`

Add slide with data `data` at index `n`.  If `n` not provided, then add at end.

`Timeline.removeSlide(n)`

Remove slide at index `n`.

`Timeline.removeSlideId(n)`

Remove slide with id `n`.

### Other

`getData(n)`

`getDataId(n)`

Get data for slide by index or id.  Slide data is stored in `Timeline.config.slides`, where config is a TimelineConfig object.

`getSlide(n)`

`getSlideId(n)`

Get VCO.Slide object for slide by index or id.  Slide objects are stored in `Timeline._storyslider._slides`



