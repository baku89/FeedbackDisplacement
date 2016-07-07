export default class BasePass {

	constructor(option) {

		this.scene = new THREE.Scene()

		// camera
		this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000)
		this.camera.position.set(0, 0, 10)
		this.scene.add(this.camera)

		this.uniforms = option.uniforms

		let material = new THREE.RawShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: option.vertexShader || require('./shaders/base-pass.vert'),
			fragmentShader: option.fragmentShader
		})

		let geometry = new THREE.BufferGeometry()
		{
			let vertices = new Float32Array([
				-1, +1, 0,
				-1, -1, 0,
				+1, +1, 0,

				-1, -1, 0,
				+1, -1, 0,
				+1, +1, 0
			])

			let uvs = new Float32Array([
				0, 1,
				0, 0,
				1, 1,

				0, 0,
				1, 0,
				1, 1
			])

			geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
			geometry.addAttribute('uUv', new THREE.BufferAttribute(uvs, 2))
		}

		let plane = new THREE.Mesh(geometry, material)

		this.scene.add(plane)
	}

	render(targetRenderer) {
		window.renderer.render(this.scene, this.camera, targetRenderer)
	}
}
