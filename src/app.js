const THREE = require('three')

class App {

	constructor() {}

	init() {

		this.scene = new THREE.Scene()
		this.renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('canvas'),
			antialias: false
		})

		// camera
		this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000)
		this.camera.position.set(0, 0, 10)
		// this.camera.rotation.set(0, -Math.PI / 4, 0)
		this.scene.add(this.camera)

		let mat = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: require('./shaders/fill.vert'),
			fragmentShader: require('./shaders/filter.frag'),
			wireframe: true
		})

		// draw plane
		this.plane = new THREE.Mesh(
			new THREE.PlaneGeometry(0.1, 0.1, 10, 10),
			mat//new THREE.MeshBasicMaterial({wireframe: true})
		)
		this.scene.add(this.plane)

		this.uniforms = {
			resolution: {type: 'v2', value: new THREE.Vector2()}
		}


		{
			let axis = new THREE.AxisHelper(5)
			this.scene.add(axis)
		}

		window.addEventListener('resize', this.onResize.bind(this))
		window.addEventListener('click', this.onClick.bind(this))


		this.onResize()

		this.animate()
	}

	animate() {
		this.renderer.render(this.scene, this.camera)
	}

	onResize() {
		const w = window.innerWidth
		const h = window.innerHeight

		this.renderer.setSize(w, h)
		this.renderer.render(this.scene, this.camera)
		this.uniforms.resolution.set(w, h)
	}

	onClick() {

	}


}


new App().init()
