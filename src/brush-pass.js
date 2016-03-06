import BasePass from './base-pass.js'


export default class BrushPass extends BasePass {

	constructor(renderer, w, h) {

		let uniforms = {
			resolution: {type: 'v2', value: new THREE.Vector2()},
			prev: {type: 't', value: null},
			image: {type: 't', value: window.kumiko},
			cursor: {type: 'v2', value: new THREE.Vector2()},
			imageOpacity: {type: 'f', value: 0},
			frequency: {type: 'f', value: 2},
			speed: {type: 'f', value: 0.002}
		}

		super(renderer, {
			fragmentShader: require('./shaders/brush-pass.frag'),
			uniforms: uniforms
		})

		let targetOption = {
			depthBuffer: false,
			stencilBuffer: false
		}

		this.renderer = renderer

		this.prevTexture = new THREE.WebGLRenderTarget(w, h, targetOption)
		this.texture = new THREE.WebGLRenderTarget(w, h, targetOption)

		this.uniforms.prev.value = this.texture

		// this.pass = new BasePass(this.renderer, {
		// 	fragmentShader: require('./shaders/brush-pass.frag'),
		// 	uniforms: this.uniforms
		// })

		window.addEventListener('click', this.onClick.bind(this))
	}

	onClick(e) {
		this.uniforms.cursor.value.set(e.offsetX, e.offsetY)
		this.uniforms.imageOpacity.value = 1
	}

	render() {

		let swap = this.prevTexture
		this.prevTexture = this.texture
		this.texture = swap

		this.uniforms.prev.value = this.prevTexture

		super.render(this.texture)

		this.uniforms.imageOpacity.value = 0
	}

	setSize(w, h) {
		super.setSize(w, h)
		this.uniforms.resolution.value.set(w, h)
		this.prevTexture.setSize(w, h)
		this.texture.setSize(w, h)
	}

}
