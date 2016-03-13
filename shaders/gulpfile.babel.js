const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const osc = require('node-osc')
const through = require('through2')

//==================================================
let client = new osc.Client('127.0.0.1', 1234)

gulp.task('glslify', () => {
	gulp.src('.')
		.pipe($.shell([
			'/usr/local/bin/glslify of-brush-pass.frag -o ../of/bin/data/brush-pass.frag',
			'/usr/local/bin/glslify of-brush-pass.vert -o ../of/bin/data/brush-pass.vert',
			'/usr/local/bin/glslify of-render-pass.frag -o ../of/bin/data/render-pass.frag'
		]))
		.pipe(through.obj(() => {
			client.send('/update-shader', 0)
		}))
})

//==================================================
gulp.task('watch', () => {
	gulp.watch(['./*.frag', './*.vert', './*.glsl'], ['glslify'])
})
//==================================================

gulp.task('default', ['glslify', 'watch'])
