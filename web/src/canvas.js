import THREE from 'three'
import 'jquery.transit'

import FlowPass from './flow-pass'
import BasePass from './base-pass'

export default class Canvas {

	constructor() {

		this.width = 1280
		this.height = 720
		this.$canvas = $('#canvas')
		this.$wrapper = $('.canvas-wrapper')

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

	}

	//----------------------------------------
	// private

	// event
	_onMousedown() {
		this.flowPass.enableDisplace = true
	}

	_onMouseup() {
		this.flowPass.enableDisplace = false
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

	update() {
		this.flowPass.render()
		this.renderPass.render()
	}

	resetByTexture(texture) {
		this.initialTexture = texture
		this.width = this.initialTexture.image.width
		this.height = this.initialTexture.image.height
		this._updateCanvas()

		this.flowPass.resetByTexture(this.initialTexture)
	}
}
