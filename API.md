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

 `back_to_start` _when user clicks control to return to beginning of timeline_
 
 `change` _when the current slide changes_

* uniqueid: string, id of the new current slide

`color_change` _when background of current slide changes_

* uniqueid: string, id of the new current slide

`dataloaded` _after data has been loaded_

`hash_updated` _when the hashbookmack in the url bar is updated_

* uniqueid:  string, id of the new current slide
* hashbookmark: string, the hash

`loaded` _after story slider and time navigator have been loaded_

* scale: "javascript" or "cosmological", the type of date scale
* slides: array, the processed slide data

`zoom_in` _when user zooms in the time navigator_

`zoom_out` _when user zooms out the time navigator_

* zoom_level: integer, current zoom level


### Navigation

`goTo(<int index>)`

`goToId(<string id>)`

Go to slide.

`goToNext()`

`goToPrev()`

Go to the next/previous slide

`goToStart()`

`goToEnd()`

Go to the first/last slide

`remove(<int index>)`

`removeId(<string id>)`

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



