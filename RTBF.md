#Usage of the build files of TimelineJS3 on RTBF
================================================

## How to build

Read the instructions from [CONTRIBUTING.md](CONTRIBUTING.md)


## Once `fab build` is done
The files must be copied to [cryo-news-common](https://github.com/RTBF/cryo-news-common).

We do not use a folder with the version number because we did modify the source by adding support for RTBF auvio medias. Because of this, it is incorrect to work with their version number.

### JS
The compiled JS files:

* `timeline-min.js`
* `timeline.js`

Must be copied inside this folder [`/news/common/public/static/js/vendor/timelinejs`](https://github.com/RTBF/cryo-news-common/tree/master/public/static/js/vendor/timelinejs)

### [S]CSS
The built CSS file `timeline.css` should be copied in [`/news/common/public/static/scss/vendor/timelinejs/`](https://github.com/RTBF/cryo-news-common/tree/master/public/static/scss/vendor/timelinejs) and its extension modified to `.scss`.

This way, the file will be versioned in GitHub and compiled to CSS...

Do the same with the files inside the folders `fonts` and `themes`

See:

* [`/news/common/public/static/scss/vendor/timelinejs/fonts/`](https://github.com/RTBF/cryo-news-common/tree/master/public/static/scss/vendor/timelinejs/fonts)
* [`/news/common/public/static/scss/vendor/timelinejs/themes/`](https://github.com/RTBF/cryo-news-common/tree/master/public/static/scss/vendor/timelinejs/themes)


#### Font files
The generated (and minified) CSS files use fontface files.
The location of these files will have to be updated but first...

The `tl-icons` font files must be copied to [`/news/common/public/static/font/tl-icons/`](https://github.com/RTBF/cryo-news-common/tree/master/public/static/font/tl-icons)

Now that the files were copied, we must fix the path to the font files by overwriting the `@font-face` declaration. This is done for you in [`/news/common/public/static/scss/vendor/tl-icons/tl-icons.scss`](https://github.com/RTBF/cryo-news-common/tree/master/public/static/scss/vendor/tl-icons/tl-icons.scss) so you won't have to do it unless, you add/remove icons.

## Meet the module from cryo-news-common
The module located at `/news/common/module/timelinejs` uses the copied JS and CSS files.

This module contains an example of integration of Timelines but it'll be updated in order to reach our goals.