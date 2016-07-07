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
				speed: {type: 'f', value: 0.1},
				seed: {type: 'f', value: 0}
			}
		})

		this.speed = 1
		this.enableDisplace = false

		this.prevRenderTarget = new THREE.WebGLRenderTarget()
		this.currentRenderTarget = new THREE.WebGLRenderTarget()
		this.texture = this.currentRenderTarget.texture

		this.passthruPass = new BasePass({
			fragmentShader: require('./shaders/passthru.frag'),
			uniforms: {
				texture: {type: 't', value: null}
			}
		})

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

		if (this.resetTexture) {
			// this.resetTexture = null
			this.passthruPass.uniforms.texture.value = this.resetTexture
			this.passthruPass.render(this.currentRenderTarget)
			this.resetTexture = null

		} else {
			this.uniforms.prevTexture.value = this.prevRenderTarget

			this.uniforms.speed.value = this.speed * (this.enableDisplace ? 1 : 0)

			super.render(this.currentRenderTarget)
		}

		this.texture = this.currentRenderTarget.texture
	}

	resetByTexture(texture) {
		this.resetTexture = texture
	}

	setSize(w, h) {
		this.prevRenderTarget.setSize(w, h)
		this.currentRenderTarget.setSize(w, h)
		// this.uniforms.aspect.value = h / w
	}
}
