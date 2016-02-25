const PIXI = require('pixi')

console.log(PIXI.WebGLRenderer)

class App {

	constructor() {}

	init() {

		this.renderer = new PIXI.WebGLRenderer(800, 600)
		this.stage = new PIXI.Stage(0x0, true)

		document.body.appendChild(this.renderer.view)

		this.uniforms = {
			resolution: {type: '2f', value: {x:0, y:0}}
		}

		// make filter
		{
			let filter = new PIXI.AbstractFilter(
				require('./shaders/filter.frag'),
				this.uniforms
			)

			this.stage.filters = [filter]
		}



		this.onResize()

		this.animate()
	}

	animate() {
		// requestAnimationFrame(this.animate)

		this.renderer.render(this.stage)
	}

	onResize() {
		this.uniforms.resolution.value.x = window.innerWidth
		this.uniforms.resolution.value.y = window.innerHeight
	}


}


new App().init()
