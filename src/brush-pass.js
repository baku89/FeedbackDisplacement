import BasePass from './base-pass.js'


export default class BasePass {

	constructor() {

		const w = window.innerWidth
		const h = window.innerHeight

		this.uniform = {
			resolution: {type: 'v2', value: new THREE.Vector2()},
			prev: {type: 't', value: null},
			cursor: {type: 'v2', value: new THREE.Vector2()}
		}

		let targetOption = {
			width: w,
			height: h
		}

		this.prevTexture = new THREE.WebGLRenderTarget(targetOption)
		this.texture = new THREE.WebGLRenderTarget(targetOption)

		this.pass = new BasePass({
			width: w,
			height: h,
			fragmentShader: require('./shaders/brush.frag')
		})

		window.addEventListener('resize', this.onResize.bind(this))
	}

	render() {

		let swap = this.prevTexture
		this.prevTexture = this.texture
		this.texture = swap

		this.uniforms.prev.value = this.prevTexture
		this.pass.render(this.texture)
	}


	onResize() {
		const w = window.innerWidth
		const h = window.innerHeight

		this.uniforms.resolution.value.set(w, h)
		this.pass.setSize(w, h)
	}

}
