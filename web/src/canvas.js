import THREE from 'three'
import 'jquery.transit'

export default class Canvas {

	constructor() {

		this.width = 1280
		this.height = 720
		this.$canvas = $('#canvas')
		this.$wrapper = $('.canvas-wrapper')

		this.renderer = new THREE.WebGLRenderer({
			canvas: this.$canvas[0]
		})

		this.renderer.setClearColor(0x000000)
		this.updateCanvas()


		$(window).on('resize', this.onResize.bind(this))

	}

	onResize() {
		this.updateCanvas()
	}

	updateCanvas() {
		// this.renderer.setSize(window.innerWidth, window.innerHeight)

		this.renderer.setSize(this.width, this.height)

		let sw = this.$wrapper.width() / this.width
		let sh = this.$wrapper.height() / this.height

		console.log(this.$wrapper.width())
		console.log(this.$wrapper.height())

		let scale = Math.min(sw, sh)

		let x = (this.$wrapper.width() - this.width * scale) / 2
		let y = (this.$wrapper.height() - this.height * scale) / 2

		this.$canvas.css({scale, x, y})

	}

	update() {

	}

}
