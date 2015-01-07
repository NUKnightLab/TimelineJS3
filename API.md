#TimelineJS3 API

### Events

```javascript

// Create new Timeline object
var timeline = new VCO.Timeline(...);

// Set event handlers
// event_name = string, name of the event, e.g. "change"
// data = JavaScript object containing event-specific properties listed below
timeline.on(event_name, function(data) {
    // handle event
});
```

 `back_to_start`

* uniqueid: string, id of the new current slide

Event is fired when the user clicks the control to return to the beginning of the timeline.  

`change`

* uniqueid: string, id of the new current slide

Event is fired when the current slide changes.

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

`Timeline.goTo(<int index>)`

`Timeline.goToId(<string id>)`

Go to slide.

`Timeline.goToNext()`

`Timeline.goToPrev()`

Go to the next/previous slide

`Timeline.goToStart()`

`Timeline.goToEnd()`

Go to the first/last slide

`Timeline.remove(<int index>)`

`Timeline.removeId(<string id>)`

Remove slide.


### Data Access

`getData(<int index>)`

`getDataId(<string id>)`

Get data for slide.

`getSlide(<int index>)`

`getSlideId(<string id>)`

Get VCO.Slide object for slide.

####TO DO?

`Timeline.goToTitle()`

This was mentioned, but I don't really know if this makes sense.  I think there are ongoing discussions about title slides, so this is on hold until that is decided.

`Timeline.add(data, n)`

Add slide with data `data` at index `n`.  If `n` not provided, then add at end.



