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

		this.updateCanvas()

		$(window).on('resize', this.onResize.bind(this))

	}

	onResize() {
		this.updateCanvas()
	}

	updateCanvas() {
		// this.renderer.setSize(window.innerWidth, window.innerHeight)

		window.renderer.setSize(this.width, this.height)
		this.flowPass.setSize(this.width, this.height)

		let sw = this.$wrapper.width() / this.width
		let sh = this.$wrapper.height() / this.height

		let scale = Math.min(sw, sh)
		let x = (this.$wrapper.width() - this.width * scale) / 2
		let y = (this.$wrapper.height() - this.height * scale) / 2

		this.$canvas.css({x, y, scale})

	}

	update() {

		this.flowPass.render()
		this.renderPass.render()

	}

}
