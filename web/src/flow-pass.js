import BasePass from './base-pass.js'

/*

Contains optical flow texture.
Each pixel  represents direction of flow.

*/

export default class FlowPass extends BasePass {

	constructor(fragmentShader) {

		let uniforms = {
			aspect: {type: 'f', value: 1},
			frequency: {type: 'f', value: 1.5},
			speed: {type: 'f', value: 0},
			seed: {type: 'f', value: 0}
		}

		super({
			fragmentShader: fragmentShader,
			uniforms: uniforms
		})

		this.texture = new THREE.WebGLRenderTarget()
	}

	set aspect(value) { this.uniforms.aspect.value = value }
	set frequency(value) { this.uniforms.frequency.value = value }
	set speed(value) { this.uniforms.speed.value = value }
	set seed(value) { this.uniforms.seed.value = value }

	render() {
		super.render(this.texture)
	}

	setSize(w, h) {
		this.texture.setSize(w, h)
		this.uniforms.aspect.value = h / w
	}
}
