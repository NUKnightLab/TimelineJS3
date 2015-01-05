#TimelineJS3 API

### Events

```javascript
timeline.on(eventtype function(data) {

});
```

 `back_to_start`

* uniqueid: string, id of the new current slide

Event is fired when the user clicks the control to return to the beginning of the timeline.  

`change`

* uniqueid: string, id of the new current slide

Event is fired when the current slide changes.  Maybe change this so that the event data consists for the previous and current slide index and/or ids.  I don't necessarily know why we would need the previous index though.

`color_change`

* uniqueid: string, id of the new current slide

Event is fired when the background of the current slide changes?

`dataloaded`

Event is fired after data has been loaded.

`hash_updated`

* uniqueid:  string, id of the new current slide
* hashbookmark: string, the hash

Event is fired when the hashbookmark in the url bar is updated.

`loaded`

* scale: "javascript" or "cosmological", the type of date scale
* slides: array, the processed slide data

Event is fired after story slider and time navigator have loaded.

`zoom_in`

* zoom_level: integer, current zoom level

Event is fired when user zooms in the time navigator.

`zoom_out`

* zoom_level: integer, current zoom level

Fired when user zooms out the time navigator.


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


