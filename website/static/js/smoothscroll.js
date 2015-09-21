$ = jQuery;
$(document).ready(function(){
  function navSmartScroll($destination) {
    var offset = $(".navbar").height() || 0,
        scrollTop = $destination.offset().top;
    $("body,html").animate({scrollTop: scrollTop}, 350);
  }

  // Navbar scrollTo
  $(".navbar .nav a, [data-scroll='true']").click(function (e) {
    var $target = $(this)
      , href = $target.attr("href")
      , hash = href.substring(href.lastIndexOf('#'))
      , $destination = $(hash);
    // fix for unpredictable scrolling behaviour on #preview-embed
    if ($destination.css("display") == "none") {
      $destination.css("display", "block");
      $destination = $destination.parent();
    }
    navSmartScroll($destination);

    return false;
  });
});
