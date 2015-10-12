//StoryJS Embed Loader
// Provide a bootstrap method for instantiating a timeline. On page load, check the definition of these window scoped variables in this order: [url_config, timeline_config, storyjs_config, config]. As soon as one of these is found to be defined with type 'object,' it will be used to automatically instantiate a timeline.

/*  CodeKit Import
  https://incident57.com/codekit/
================================================== */
// @codekit-prepend "Embed.LoadLib.js";

if(typeof embed_path == 'undefined') {
  // REPLACE WITH YOUR BASEPATH IF YOU WANT OTHERWISE IT WILL TRY AND FIGURE IT OUT
  var _tmp_script_path = getEmbedScriptPath("timeline-embed.js");
  var embed_path = _tmp_script_path.substr(0,_tmp_script_path.lastIndexOf('js/'))
}

function getEmbedScriptPath(scriptname) {
  var scriptTags = document.getElementsByTagName('script'),
    script_path = "",
    script_path_end = "";
  for(var i = 0; i < scriptTags.length; i++) {
    if (scriptTags[i].src.match(scriptname)) {
      script_path = scriptTags[i].src;
    }
  }
  if (script_path != "") {
    script_path_end = "/"
  }
  return script_path.split('?')[0].split('/').slice(0, -1).join('/') + script_path_end;
}

/* CHECK TO SEE IF A CONFIG IS ALREADY DEFINED (FOR EASY EMBED)
================================================== */
(function() {
  if (typeof url_config == 'object') {
    createStoryJS(url_config);
  } else if (typeof timeline_config == 'object') {
    createStoryJS(timeline_config);
  } else if (typeof storyjs_config == 'object') {
    createStoryJS(storyjs_config);
  } else if (typeof config == 'object') {
    createStoryJS(config);
  } else {
    // No existing config. Call createStoryJS(your_config) manually with a config
  }
})();

/* CREATE StoryJS Embed
================================================== */
function createStoryJS(c, src) {
  /* VARS
  ================================================== */
  var storyjs_embedjs, t, te, x,
    isCDN         = false,
    js_version        = "2.24",
    ready = {
      timeout:  "",
      checks:   0,
      finished: false,
      js:     false,
      css:    false,
      font: {
        css:  false
      }
    },
    path = {
      base:   embed_path,
      css:    embed_path + "css/",
      js:     embed_path + "js/",
      font: {
        google: false,
        css:  embed_path + "css/fonts/",
        js:   "//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"
      }
    },
    storyjs_e_config = {
      version:  js_version,
      debug:    false,
      type:   'timeline',
      id:     'storyjs',
      embed_id: 'timeline-embed',
      is_embed:   true,
      width:    '100%',
      height:   '100%',
      source:   'https://docs.google.com/spreadsheet/pub?key=0Agl_Dv6iEbDadFYzRjJPUGktY0NkWXFUWkVIZDNGRHc&output=html',
      lang:   'en',
      font:   'default',
      start_at_end: false,
      timenav_position: 'bottom',
      css:    path.css + 'timeline.css?'+js_version,
      js:     '',
      api_keys: {
        google:       "",
        flickr:       "",
        twitter:      ""
      },
      gmap_key:   ""
    }
  /* BUILD CONFIG
  ================================================== */
  if (typeof c == 'object') {
    for (x in c) {
      if (Object.prototype.hasOwnProperty.call(c, x)) {
        storyjs_e_config[x] = c[x];
      }
    }
  }

  if (typeof src != 'undefined') {
    storyjs_e_config.source = src;
  }

  /* CDN VERSION?
  ================================================== */
  if (typeof url_config == 'object') {
    isCDN = true;

    /* IS THE SOURCE GOOGLE SPREADSHEET WITH JUST THE KEY?
    ================================================== */
    if (storyjs_e_config.source.match("docs.google.com") || storyjs_e_config.source.match("json") || storyjs_e_config.source.match("storify") ) {

    } else {
      storyjs_e_config.source = "https://docs.google.com/spreadsheet/pub?key=" + storyjs_e_config.source + "&output=html";
    }

  }

  /* DETERMINE TYPE
  ================================================== */
  if (storyjs_e_config.js.match("/")) {

  } else {
    storyjs_e_config.css  = path.css + storyjs_e_config.type + ".css?" + js_version;

    // Use unminified js file if in debug mode
    storyjs_e_config.js   = path.js  + storyjs_e_config.type;
    if (storyjs_e_config.debug) {
      storyjs_e_config.js += ".js?"  + js_version;
    } else {
      storyjs_e_config.js += "-min.js?"  + js_version;
    }

    storyjs_e_config.id   = "storyjs-" + storyjs_e_config.type;
  }

  /* PREPARE
  ================================================== */
  createEmbedDiv();

  /* Load CSS
  ================================================== */
  LoadLib.css(storyjs_e_config.css, onloaded_css);

  /* Load FONT
  ================================================== */
  if (storyjs_e_config.font == "default") {
    ready.font.css    = true;
  } else {
    // FONT CSS
    var fn;
    if (storyjs_e_config.font.match("/")) {
      fn        = storyjs_e_config.font.split(".css")[0].split("/");
      path.font.name  = fn[fn.length -1];
      path.font.css = storyjs_e_config.font;
    } else {
      path.font.name  = storyjs_e_config.font;
      path.font.css = path.font.css + "font."+storyjs_e_config.font.toLowerCase()+".css?" + js_version;
    }
    LoadLib.css(path.font.css, onloaded_font_css);
  }
    LoadLib.js(storyjs_e_config.js, onloaded_js);

  /* On Loaded
  ================================================== */

  function onloaded_js() {
    ready.js = true;
    onloaded_check();
  }

  function onloaded_css() {
    ready.css = true;
    onloaded_check();
  }
  function onloaded_font_css() {
    ready.font.css = true;
    onloaded_check();
  }
  function onloaded_check() {
    if (ready.checks > 40) {
      return;
      alert("Error Loading Files");
    } else {
      ready.checks++;
      if (ready.js && ready.css && ready.font.css) {
        if (!ready.finished) {
          ready.finished = true;
          buildEmbed();
        }
      } else {
        ready.timeout = setTimeout('onloaded_check_again();', 250);
      }
    }
  };
  this.onloaded_check_again = function() {
    onloaded_check();
  };

  /* Build Timeline
  ================================================== */
  function createEmbedDiv() {
    var embed_classname = "tl-timeline-embed";

    t = document.createElement('div');

    if (storyjs_e_config.embed_id != "") {
      te = document.getElementById(storyjs_e_config.embed_id);
    } else {
      te = document.getElementById("timeline-embed");
    }

    te.appendChild(t);
    t.setAttribute("id", storyjs_e_config.id);

    if (storyjs_e_config.width.toString().match("%") ) {
      te.style.width = storyjs_e_config.width.split("%")[0] + "%";
    } else {
      storyjs_e_config.width = storyjs_e_config.width - 2;
      te.style.width = (storyjs_e_config.width) + 'px';
    }

    if (storyjs_e_config.height.toString().match("%")) {
      te.style.height = storyjs_e_config.height;
      embed_classname += " tl-timeline-full-embed";
      te.style.height = storyjs_e_config.height.split("%")[0] + "%";

    } else if (storyjs_e_config.width.toString().match("%")) {
      embed_classname += " tl-timeline-full-embed";
      storyjs_e_config.height = storyjs_e_config.height - 16;
      te.style.height = (storyjs_e_config.height) + 'px';
    }else {
      embed_classname += " sized-embed";
      storyjs_e_config.height = storyjs_e_config.height - 16;
      te.style.height = (storyjs_e_config.height) + 'px';
    }

    te.setAttribute("class", embed_classname);
    te.setAttribute("className", embed_classname);
    t.style.position = 'relative';
  }

  function buildEmbed() {
    TL.debug = storyjs_e_config.debug;

    storyjs_e_config['ga_property_id'] = 'UA-27829802-4';
    storyjs_e_config.language = storyjs_e_config.lang;
    if (storyjs_e_config.width == '100%') {
      storyjs_e_config.is_full_embed = true;
    }
    window.timeline = new TL.Timeline('timeline-embed', storyjs_e_config.source, storyjs_e_config);

  }

}
