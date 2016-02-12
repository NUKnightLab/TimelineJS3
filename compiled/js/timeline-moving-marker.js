setTimeout(function () {
  $('.tl-timenav-slider').css('left', $('.tl-menubar').width());
  moveMarker();
}, 1000);

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

function moveMarker() {
  var nowpos = timeline._timenav.timescale.getPosition(new Date());
  createMarker().css({ left: nowpos });
  if (goToNowSlide())
    setTimeout(moveMarker, 1000);
}

function goToNowSlide() {
  var now = TL.Date.makeDate(new Date());
  var current = timeline.getCurrentSlide().data;

  if (timeline.config.title.unique_id === current.unique_id) {
    return true;
  }

  // current slide is before now
  if (timeline.config.getLatestDate().isAfter(now)
    && current.start_date.isBefore(now)
    && current.end_date.isBefore(now)) {
    timeline.goToNext();
    return goToNowSlide();
  }

  // current slide is after now
  if (timeline.config.getEarliestDate().isBefore(now)
    && current.start_date.isAfter(now)
    && current.end_date.isAfter(now)) {
    timeline.goToPrev();
    return goToNowSlide();
  }

  return true; // don't move
}
