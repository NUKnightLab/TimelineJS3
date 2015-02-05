// overcome Timeline's stupid jQuery loading
var $blueline = $.noConflict();
$blueline(document).ready(function() {
  var $ = $blueline;
  function navSmartScroll($destination) {
    var offset = $(".navbar").height() || 0,
        scrollTop = $destination.offset().top - 30;
    $("body,html").animate({scrollTop: scrollTop}, 350);
  }

  // Navbar scrollTo
  $(".navbar .nav a, [data-scroll='true']").click(function (e) {
    var $target = $(this)
      , href = $target.attr("href")
      , hash = href.substring(href.lastIndexOf('#'))
      , $destination = $(hash);
    navSmartScroll($destination);

    return false;
  });

  // More Options
  $(".show-options").click(function (e) {
    $(this).hide();

    $(".more-options").slideDown();

    return false;
  });
 
  $("#font-preview-trigger").popover()
 
  // Preview
  $("#iframe-preview-button").click(function () {
    var $embed = $("#preview");

    $embed.show();
    
    // Need to 'reload' the iframe to get it to display correctly
    var $if = $("#preview iframe");
    $if.attr("src", $if.attr("src"));
    
    $("body,html").animate({scrollTop: $embed.offset().top - 60}, 250);
  });



  // Embed Generator
  //updateEmbedCode();
  $("#embed_code").click(function() { $(this).select(); });
  $('#embed-width').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-wordpressplugin').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-font').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-height').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-maptype').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-googlemapkey').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-source-url').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-language').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-startatend').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-hashbookmark').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-startatslide').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-startzoomadjust').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-debug').change(function(evt) { updateEmbedCode(evt); });

  $('.collapse').on('show',function(e) {
    window.location.hash = "show-" + $(this).attr('id');
  })

  if (window.location.hash.match(/#show-/)) {
    var $target = $("#" + window.location.hash.substr(6));
    $target.collapse('show');
    navSmartScroll($target.prev());
  }

  // Set up preview box
  function do_preview(key) {
    $("#preview-required").hide();
    $("#timeline-wrapper").hide();
    var url = null;
    if (key && typeof(key) == 'string') {
      url = key;      
    } else {
      url = document.getElementById('url').value;
    }
    if (url) {
      $("#timeline-wrapper").show();

      $('html, body').animate({
          scrollTop: $("#timeline-wrapper").offset().top
      }, 2000);
      $("#timeline-wrapper")[0].scrollIntoView( true );

      new_timeline(url);

    } else {
      $("#preview-required").show();
    }
  }
  var timeline = null;
  var button = document.getElementById('go-preview');
  button.addEventListener('click',do_preview);

  document.getElementById('url').addEventListener('keyup',function(evt) {
    if (evt.keyCode == 13) {
      do_preview();
    }
  });

  function new_timeline(url) {
      timeline = null; // TODO: actively 'destroy' an existing timeline?
      if (!url) {
        throw("Should be called with a url.")
      } else {
        var json = VCO.ConfigFactory.fromGoogle(url);
        $("#export-json").show();
        $("#url").val('');
        window.factory_json = json;
        $("#json-export-field").val(JSON.stringify(json,null,"  "));
        /*document.getElementById('input').style.height = "40px"*/
        document.getElementById('timeline').style.height = (window.innerHeight - 95 + "px");

        timeline = new VCO.Timeline('timeline', new VCO.TimelineConfig(json), {
        });

        window.onresize = function(event) {
            console.log("resize")
            document.getElementById('input').style.height = "30px"
            document.getElementById('timeline').style.height = (window.innerHeight - 95 + "px");
            timeline.updateDisplay();
        }
      }
  }

  function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
  }

});
