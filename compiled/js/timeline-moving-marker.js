(function ($, timeline) {

// wait for timeline.js to initialize
setTimeout(moveMarker, 1000);

timeline._movingMarker = {
  moveMarker: moveMarker,
  createMarker: createMarker,
  goToNowSlide: goToNowSlide,
};

function moveMarker() {
  createMarker($).css({
    left: timeline._timenav.timescale.getPosition(new Date()),
  });
  goToNowSlide(timeline);
  setTimeout(moveMarker, 1000);
}

function createMarker() {
  if ($('#tl-timenav-marker').length)
  {
    return $('#tl-timenav-marker');
  }
  var marker = $('.tl-timenav-item-container > div.tl-timemarker').first().clone();
  marker.attr('id', 'tl-timenav-marker').css({
    width: '5px',
    top: '5px',
    'background-color': '#F00',
    'z-index': 3,
  });
  marker.find('.tl-timemarker-content-container').remove();
  marker.find('.tl-timemarker-timespan-content').remove();
  $('.tl-timenav-item-container').prepend(marker);
  return marker;  
}

function goToNowSlide(timeline) {
  var now = TL.Date.makeDate(new Date());
  var current = timeline.getCurrentSlide().data;

  // if current slide is of type "title", don't start
  if (timeline.config.title.unique_id === current.unique_id) {
    return true;
  }

  // current slide is before now
  if (timeline.config.getLatestDate().isAfter(now)
    && current.start_date.isBefore(now)
    && current.end_date.isBefore(now)) {
    timeline.goToNext();
    return goToNowSlide(timeline);
  }

  // current slide is after now
  if (timeline.config.getEarliestDate().isBefore(now)
    && current.start_date.isAfter(now)
    && current.end_date.isAfter(now)) {
    timeline.goToPrev();
    return goToNowSlide(timeline);
  }

  return true; // don't move
}

})(Zepto, timeline);