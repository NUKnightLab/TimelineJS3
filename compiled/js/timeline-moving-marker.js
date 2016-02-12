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

function findStartEndDate (slides) {
  var global_start_date;
  var global_end_date;
  slides.forEach(function (el, i) {
    var start_date = el.data.start_date;
    var end_date = el.data.end_date;
    if (! (start_date instanceof TL.Date)) {
      start_date = new TL.Date(start_date);
    };
    if (! (end_date instanceof TL.Date)) {
      end_date = new TL.Date(end_date);
    };
    if (! global_start_date || global_start_date.isAfter(start_date)) {
      global_start_date = start_date;
    }
    if (! global_end_date || global_end_date.isBefore(end_date)) {
      global_end_date = end_date;
    }
  });
  return {
    start_date: global_start_date,
    end_date: global_end_date,
  }
}

function goToNowSlide() {
  var now = TL.Date.makeDate(new Date());
  var current = timeline.getCurrentSlide().data;
  var start_end = findStartEndDate(timeline._storyslider._slides);

  if (timeline.config.title.unique_id === current.unique_id) {
    return true;
  }

  // current slide is before now
  if (start_end.end_date.isAfter(now)
    && current.start_date.isBefore(now)
    && current.end_date.isBefore(now)) {
    timeline.goToNext();
    return goToNowSlide();
  }

  // current slide is after now
  if (start_end.start_date.isBefore(now)
    && current.start_date.isAfter(now)
    && current.end_date.isAfter(now)) {
    timeline.goToPrev();
    return goToNowSlide();
  }

  return true; // don't move
}
