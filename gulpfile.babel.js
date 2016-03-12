/* global process */

const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const notifier = require('node-notifier')
const webpack = require('webpack')
const WebpackStream = require('webpack-stream')
const BrowserSync = require('browser-sync')

const browserSync = BrowserSync.create()

let developmentMode = true

//==================================================
gulp.task('webpack', () => {
	let config = require('./webpack.config.js')

	if (developmentMode) {
		config.devtool = 'inline-source-map'
		config.watch = true
	} else {
		config.plugins.push(
			// new webpack.optimize.UglifyJsPlugin(),
			new webpack.optimize.DedupePlugin()
		)
	}

	return gulp.src('')
		.pipe($.plumber())
		.pipe(WebpackStream(config))
		.pipe(gulp.dest('build'))
    .pipe(browserSync.stream())
})

//==================================================
gulp.task('electron-dev', () => {
	return gulp.src('src/index.js')
		.pipe($.plumber())
		.pipe($.eslint({useEslintrc: true}))
		.pipe($.sourcemaps.init())
		.pipe($.babel({presets: ['es2015']}))
		.pipe(gulp.dest('build'))
})

//==================================================
gulp.task('jade', () => {
	return gulp.src('./src/index.jade')
		.pipe($.plumber())
		.pipe($.jade({pretty: developmentMode}))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.stream())
})

//==================================================
gulp.task('stylus', () => {
	return gulp.src('./src/style.styl')
		.pipe($.plumber())
		.pipe($.stylus({use: require('nib')()}))
		.pipe($.autoprefixer())
		// .pipe($.if(!developmentMode, $.minifyCss()))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.stream())

})

//==================================================
gulp.task('browser-sync', () => {
	browserSync.init({
		port: 9999,
		open: false,
		server: {
			baseDir: 'build'
		}
	})
})

//==================================================
gulp.task('watch', () => {
	gulp.watch('./src/index.js', ['electron-dev'])
	gulp.watch('./src/style.styl', ['stylus'])
	gulp.watch('./src/index.jade', ['jade'])
})

//==================================================
gulp.task('release', () => {
	developmentMode = false
	process.env.NODE_ENV = 'production'
})

//==================================================

gulp.task('default', ['webpack', 'jade', 'stylus', 'electron-dev', 'watch', 'browser-sync'])
gulp.task('build', ['release', 'jade', 'stylus', 'webpack'])
