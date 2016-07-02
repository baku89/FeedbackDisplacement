/* global process */

const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const notifier = require('node-notifier')
const webpack = require('webpack')
const WebpackStream = require('webpack-stream')
const BrowserSync = require('browser-sync')

const browserSync = BrowserSync.create()

let developmentMode = true
let buildMode = 'electron'
let destPath = 'build'

process.env.NODE_ENV = 'dev'

//==================================================
gulp.task('webpack', () => {
	let config = require('./webpack.config.js')

	// modify conig
	if (developmentMode) {
		config.devtool = 'inline-source-map'
		config.watch = true
	} else {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.optimize.DedupePlugin()
		)
	}
	config.target = buildMode

	return gulp.src('')
		.pipe($.plumber())
		.pipe(WebpackStream(config))
		.pipe(gulp.dest(destPath))
    .pipe(browserSync.stream())
})

//==================================================
gulp.task('babel', () => {
	return gulp.src('src/index.js')
		.pipe($.plumber())
		.pipe($.eslint({useEslintrc: true}))
		.pipe($.sourcemaps.init())
		.pipe($.babel({presets: ['es2015']}))
		.pipe(gulp.dest(destPath))
})

//==================================================
gulp.task('jade', () => {
	return gulp.src('./src/index.jade')
		.pipe($.plumber())
		.pipe($.jade({pretty: developmentMode}))
		.pipe(gulp.dest(destPath))
		.pipe(browserSync.stream())
})

//==================================================
gulp.task('stylus', () => {
	return gulp.src('./src/style.styl')
		.pipe($.plumber())
		.pipe($.stylus({use: require('nib')()}))
		.pipe($.autoprefixer())
		.pipe($.if(!developmentMode, $.minifyCss()))
		.pipe(gulp.dest(destPath))
		.pipe(browserSync.stream())
})

//==================================================
gulp.task('browser-sync', () => {
	browserSync.init({
		port: 9999,
		open: false,
		server: {
			baseDir: destPath
		}
	})

	if (buildMode == 'electron') {
		gulp.src('.', {read: false})
			.pipe($.shell(['/usr/local/bin/electron ./build > /dev/null']))
	}})

//==================================================
gulp.task('watch', () => {
	gulp.watch('./src/index.js', ['babel'])
	gulp.watch('./src/style.styl', ['stylus'])
	gulp.watch('./src/index.jade', ['jade'])
})

//==================================================
gulp.task('release', () => {
	developmentMode = false
	process.env.NODE_ENV = 'production'
})

gulp.task('web', () => {
	buildMode = 'web'
	destPath = 'public'
})

//==================================================

gulp.task('default', ['webpack', 'jade', 'stylus', 'babel', 'watch', 'browser-sync'])
gulp.task(destPath, ['release', 'jade', 'stylus', 'webpack'])
