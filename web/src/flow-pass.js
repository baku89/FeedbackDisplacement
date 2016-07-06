import BasePass from './base-pass.js'

/*

Contains optical flow texture.
Each pixel  represents direction of flow.

*/

export default class FlowPass extends BasePass {

	constructor() {

		super({
			fragmentShader: require('./shaders/flow-pass.frag'),
			uniforms: {
				prevTexture: {type: 't', value: null},
				aspect: {type: 'f', value: 1},
				frequency: {type: 'f', value: 1.5},
				speed: {type: 'f', value: 0},
				seed: {type: 'f', value: 0}
			}
		})

		this.prevRenderTarget = new THREE.WebGLRenderTarget()
		this.currentRenderTarget = new THREE.WebGLRenderTarget()
		this.texture = this.currentRenderTarget.texture
	}

	/*
	set aspect(value) { this.uniforms.aspect.value = value }
	set frequency(value) { this.uniforms.frequency.value = value }
	set speed(value) { this.uniforms.speed.value = value }
	set seed(value) { this.uniforms.seed.value = value }
	*/

	render() {
		[this.prevRenderTarget, this.currentRenderTarget]
			= [this.currentRenderTarget, this.prevRenderTarget]
		this.uniforms.prevTexture.value = this.prevRenderTarget.texture

		super.render(this.currentRenderTarget)

		this.texture = this.currentRenderTarget.texture
	}

	setSize(w, h) {
		this.prevRenderTarget.setSize(w, h)
		this.currentRenderTarget.setSize(w, h)
		// this.uniforms.aspect.value = h / w
	}
}
