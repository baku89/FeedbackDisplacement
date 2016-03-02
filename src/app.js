const THREE = require('three')

class App {

	constructor() {}

	init() {

		this.scene = new THREE.Scene()
		this.renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('canvas'),
			antialias: false
		})


		window.addEventListener('resize', this.onResize.bind(this))
		window.addEventListener('click', this.onClick.bind(this))
	}

	animate() {
		// requestAnimationFrame(this.animate)

		this.renderer.render(this.stage)
	}

	onResize() {
		// this.uniforms.resolution.value.x = window.innerWidth
		// this.uniforms.resolution.value.y = window.innerHeight
	}

	onClick() {

	}


}


new App().init()
