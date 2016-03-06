import BasePass from './base-pass.js'


const MIN_FLOW = 0.06

export default class BrushPass extends BasePass {

	constructor(renderer, w, h) {

		let uniforms = {
			aspect: {type: 'f', value: h / w},
			prev: {type: 't', value: null},
			image: {type: 't', value: window.kumiko},
			cursor: {type: 'v2', value: new THREE.Vector2()},
			imageOpacity: {type: 'f', value: 0},
			frequency: {type: 'f', value: 2},
			speed: {type: 'f', value: MIN_FLOW},
			speedAmp: {type: 'f', value: 0.002},
			seed: {type: 'f', value: 0}
		}

		super(renderer, {
			fragmentShader: require('./shaders/brush-pass.frag'),
			uniforms: uniforms
		})

		let targetOption = {
			// wrapS: THREE.MirroredRepeatWrapping,
			// wrapT: THREE.MirroredRepeatWrapping
		}

		this.renderer = renderer

		this.prevTexture = new THREE.WebGLRenderTarget(w, h, targetOption)
		this.texture = new THREE.WebGLRenderTarget(w, h, targetOption)

		this.uniforms.prev.value = this.texture

		// this.pass = new BasePass(this.renderer, {
		// 	fragmentShader: require('./shaders/brush-pass.frag'),
		// 	uniforms: this.uniforms
		// })

		// event
		window.Interface.on('change-flow', this.onChangeFlow.bind(this))
		window.Interface.on('overcoat', this.onOvercoat.bind(this))
		window.Interface.on('volume', this.onChangeVolume.bind(this))
		window.Interface.on('flow-speed', this.onChangeFlowSpeed.bind(this))
	}

	onChangeFlowSpeed(value) {

		this.uniforms.speedAmp.value = value * 0.05
	}

	onChangeFlow(value) {

		this.uniforms.seed.value = Math.random()
	}

	onOvercoat(value) {

		console.log(value, 'asldfjasldkfj')
		// this.uniforms.cursor.value.set(e.offsetX, e.offsetY)

		this.uniforms.imageOpacity.value = 1
	}

	onChangeVolume(value) {
		// console.log(value)
		this.uniforms.speed.value =  Math.pow(value, 3) * (1 - MIN_FLOW) + MIN_FLOW
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
		this.uniforms.aspect.value = h / w
		this.prevTexture.setSize(w, h)
		this.texture.setSize(w, h)
	}

}
