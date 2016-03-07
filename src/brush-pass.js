import BasePass from './base-pass.js'
import CoatServer from './coat-server.js'

const MIN_FLOW = 0.3

export default class BrushPass extends BasePass {

	constructor(renderer, w, h) {

		let uniforms = {
			aspect: {type: 'f', value: h / w},
			prev: {type: 't', value: null},
			image: {type: 't', value: null},
			cursor: {type: 'v2', value: new THREE.Vector2()},
			imageOpacity: {type: 'f', value: 1},
			frequency: {type: 'f', value: 1.5},
			speed: {type: 'f', value: MIN_FLOW},
			speedAmp: {type: 'f', value: 0.3 * 0.05},
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

		this.coatServer = new CoatServer((texture) => {
			this.uniforms.image.value = texture
			this.onDrawCoat()
		})

		this.prevTexture = new THREE.WebGLRenderTarget(w, h, targetOption)
		this.texture = new THREE.WebGLRenderTarget(w, h, targetOption)

		this.uniforms.prev.value = this.texture

		// event
		window.Interface.on('change-flow', this.onChangeFlow.bind(this))
		window.Interface.on('draw-coat', this.onDrawCoat.bind(this))
		window.Interface.on('volume', this.onChangeVolume.bind(this))
		window.Interface.on('flow-speed', this.onChangeFlowSpeed.bind(this))
		window.Interface.on('attack', this.onAttack.bind(this))
	}

	onAttack() {
		// console.log('attac!!!')

		this.uniforms.seed.value = Math.random()
	}

	onChangeFlowSpeed(value) {

		this.uniforms.speedAmp.value = value * 0.05
	}

	onChangeFlow() {

		this.uniforms.seed.value = Math.random()
	}

	onDrawCoat(value) {
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
