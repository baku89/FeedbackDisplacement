import 'jquery.transit'
import Mousetrap from 'mousetrap'
import FileSaver from 'filesaverjs'
// import createjs from 'imports?this=>window!exports?window.createjs!easeljs'

import FlowPass from './flow-pass'
import BasePass from './base-pass'


export default class Canvas {

	constructor() {

		this.width = 1280
		this.height = 720
		this.$canvas = $('#canvas')
		this.$easel = $('.easel')
		this.$wrapper = $('.canvas-wrapper')

		this.$cursor = $('.brush-cursor')

		// create renderer
		window.renderer = new THREE.WebGLRenderer({
			canvas: this.$canvas[0]
		})
		window.renderer.setClearColor(0x000000)

		// init passes
		this.flowPass = new FlowPass()

		this.renderPass = new BasePass({
			fragmentShader: require('./shaders/render-pass.frag'),
			uniforms: {
				prevPass: {type: 't', value: this.flowPass.texture}
			}
		})

		this._updateCanvas()

		$(window).on('resize', this._onResize.bind(this))

		this.$canvas.on({
			'mousedown': this._onMousedown.bind(this),
			'mouseup': this._onMouseup.bind(this)
		})

		this.$easel.on({
			'mouseenter': this._showCursor.bind(this),
			'mouseleave': this._hideCursor.bind(this),
			'mousemove': this._moveCursor.bind(this)
		})

		this._setupKeybind()

	}

	//----------------------------------------
	// private

	// init
	_setupKeybind() {

		Mousetrap.bind('r', () => {
			this.resetByTexture()
		})

		Mousetrap.bind('command+s', (e) => {
			this.saveAsImage()

			return false
		})

		/*
		Mousetrap.bind('command')

		this.keyboard.on('ctrl', 'activate', () => {
			this.isChangingBrushSize = true
		})
		this.keyboard.on('ctrl', 'release', () => {
			this.isChangingBrushSize = false
		})
		*/
	}

	// event
	_onMousedown() {
		this.flowPass.enableDisplace = true
	}

	_onMouseup() {
		this.flowPass.enableDisplace = false
	}

	_showCursor() {
		this.$cursor.addClass('show')
	}
	_hideCursor() {
		this.$cursor.removeClass('show')
	}
	_moveCursor(e) {

		if (this.isChangingBrushSize) {

			console.log('aaa')

		} else {

			this.$cursor.css({
				x: e.pageX - this.$easel[0].offsetLeft,
				y: e.pageY - this.$easel[0].offsetTop
			})
		}
	}

	_onResize() {
		this._updateCanvas()
	}

	_updateCanvas() {
		window.renderer.setSize(this.width, this.height)
		this.flowPass.setSize(this.width, this.height)

		let sw = this.$wrapper.width() / this.width
		let sh = this.$wrapper.height() / this.height

		let scale = Math.min(sw, sh)
		let x = (this.$wrapper.width() - this.width * scale) / 2
		let y = (this.$wrapper.height() - this.height * scale) / 2

		this.$canvas.css({x, y, scale})
	}

	//----------------------------------------
	// public

	saveAsImage() {
		this.$canvas[0].toBlob((blob) => {
			console.log(blob)
			FileSaver.saveAs(blob, 'image.png')
		})
	}

	update() {
		this.flowPass.render()
		this.renderPass.render()
	}

	resetByTexture(texture) {
		if (texture) {
			this.initialTexture = texture
		}
		this.width = this.initialTexture.image.width
		this.height = this.initialTexture.image.height
		this._updateCanvas()

		this.flowPass.resetByTexture(this.initialTexture)
	}
}
