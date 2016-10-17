var gulp 	= require('gulp'),
	include = require('gulp-include'),
	less 	= require('gulp-less'),
	clean 	= require('less-plugin-clean-css'),
	rename 	= require('gulp-rename'),
	uglify	= require('gulp-uglify'),
	usemin 	= require('gulp-usemin'),
	banner	= require('gulp-banner'),
	package = require('./package.json');

gulp.task('js', function() {
	gulp.src('source/js/TL.Timeline.js')
		.pipe(include())
		.pipe(rename('timeline.js'))
		.pipe(gulp.dest('build/js/'))
		.pipe(uglify())
		.pipe(rename('timeline-min.js'))
		.pipe(gulp.dest('build/js'));

	gulp.src('source/js/embed/Embed.CDN.js')
		.pipe(include())
		.pipe(rename('timeline-embed-cdn.js'))
		.pipe(gulp.dest('build/js'));

	gulp.src('source/js/embed/Embed.js')
		.pipe(include())
		.pipe(rename('timeline-embed.js'))
		.pipe(gulp.dest('build/js'));

	gulp.src('source/js/library/moment.js')
		.pipe(uglify())
		.pipe(gulp.dest('build/js/library'))
});

gulp.task('less', function() {
	var cleanCss = new clean({ 'clean-css': '--s0' });

	gulp.src('source/less/TL.Timeline.less')
		.pipe(less({
			plugins: [cleanCss]
		}))
		.pipe(rename('timeline.css'))
		.pipe(gulp.dest('build/css'));

	gulp.src('source/less/themes/dark/TL.Theme.Dark.less')
		.pipe(less({
			plugins: [cleanCss]
		}))
		.pipe(rename('timeline.theme.dark.css'))
		.pipe(gulp.dest('build/css/themes'));

	gulp.src('source/less/fonts/[^font.base].less')
		.pipe(less())
		.pipe(gulp.dest('build/css/fonts/'));
});

gulp.task('copy', function() {
	gulp.src([
			'website/css/*.*',
			'website/img/*.*',
			'website/js/*.*',
			'website/ico/*.*'
		])
		.pipe(gulp.dest('build'));

	gulp.src([
			'source/css/*.*',
			'source/img/*.*',
			'source/gfx/*.png',
			'source/gfx/*.jpg',
			'source/gfx/*.gif',
			'source/ico/*.*',
			'source/**/*.ico',
			'source/**/*.html',
		])
		.pipe(gulp.dest('build'));

	gulp.src('source/js/language/locale/*.json')
		.pipe(gulp.dest('build/js/locale'));

	gulp.src('source/embed')
		.pipe(gulp.dest('build'));
});

gulp.task('usemin', function() {
	gulp.src('build/embed')
		.pipe(usemin())
		.pipe(gulp.dest('build'));
});

gulp.task('banner', function() {
	var comment = 	"/*\n" +
	                "    TimelineJS - ver. <%= package.version %> - <%= date %>\n" +
	                "    Copyright (c) 2012-2016 Northwestern University\n" +
	                "    a project of the Northwestern University Knight Lab + originally created by Zach Wise\n" +
	                "    https://github.com/NUKnightLab/TimelineJS3\n" +
	                "    This Source Code Form is subject to the terms of the Mozilla Public License + v. 2.0.\n" +
	                "    If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.\n" +
	                "*/\n\n"

	gulp.src('build/js/*.js')
		.pipe(banner(comment, {package: package, date: Date.now().toLocaleString()}))
		.pipe(gulp.dest('build/js'));

	gulp.src('build/css/*.css')
		.pipe(banner(comment, {package: package, date: Date.now().toLocaleString()}))
		.pipe(gulp.dest('build/css'));
});

gulp.task('default', ['js', 'less', 'copy', 'usemin', 'banner']);