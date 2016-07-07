import BasePass from './base-pass.js'

/*

Contains optical flow texture.
Each pixel  represents direction of flow.

*/

export default class FlowPass extends BasePass {

	constructor() {

		let fragmentShader = require('./shaders/flow-pass.frag')

		super({
			fragmentShader,
			uniforms: {
				initialTexture: {type: 't', value: null},
				prevTexture: {type: 't', value: null},
				aspect: {type: 'f', value: 1},
				frequency: {type: 'f', value: 1.5},
				speed: {type: 'f', value: 0.001},
				angle: {type: 'f', value: 0},
				seed: {type: 'f', value: 0}
			}
		})

		this.baseCode = fragmentShader

		this.speed = 0.001
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

	set frequency(value) { this.uniforms.frequency.value = value }
	set seed(value) { this.uniforms.seed.value = value }
	set angle(value) { this.uniforms.angle.value = value }

	changeFlow(code) {
		let shader = this.baseCode.replace(/vec2 displace(.*)/, code)
		console.log(shader)

		this.updateFragmentShader(shader)
	}

	render() {
		[this.prevRenderTarget, this.currentRenderTarget]
			= [this.currentRenderTarget, this.prevRenderTarget]

		if (this.needsReset) {
			this.needsReset = false
			this.uniforms.initialTexture.value = this.initialTexture
			this.passthruPass.uniforms.texture.value = this.initialTexture
			this.passthruPass.render(this.currentRenderTarget)

		} else {
			this.uniforms.prevTexture.value = this.prevRenderTarget.texture

			this.uniforms.speed.value = this.speed * (this.enableDisplace ? 1 : 0)

			super.render(this.currentRenderTarget)
		}

		this.texture = this.currentRenderTarget.texture
	}

	resetByTexture(texture) {
		this.initialTexture = texture
		this.needsReset = true
	}

	setSize(w, h) {
		this.prevRenderTarget.setSize(w, h)
		this.currentRenderTarget.setSize(w, h)
		this.uniforms.aspect.value = h / w
	}
}
