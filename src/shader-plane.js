/* global THREE */

export default class App {

	constructor(option) {

		this.width = option.width
		this.height = option.height

		this.scene = new THREE.Scene()

		// renderer
		let rendererOption = {
			antialias: false
		}
		if (option.canvas) {
			rendererOption.canvas = option.canvas
		}
		this.renderer = new THREE.WebGLRenderer(renderOption)

		// camera
		this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000)
		this.camera.position.set(0, 0, 10)
		this.scene.add(this.camera)

		this.uniforms = option.uniforms

		let mat - new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: option.vertexShader || require('./shaders/shader-plane.vert'),
			fragmentShader: option.fragmentShader
		})

		let plane = new THREE.Mesh(
			new THREE.PlaneGeometry(2, 2),
			mat
		)

		this.scene.add(plane)
	}

	render(targetRenderer) {
		this.renderer.render(this.scene, this.camera, targetRenderer)
	}
}
