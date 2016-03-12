/* global Interface */

import BasePass from './base-pass.js'
import CoatServer from './coat-server.js'
import FlowManager from './flow-manager.js'

export default class BrushPass extends BasePass {

	constructor(w, h) {

		let uniforms = {
			prev: {type: 't', value: null},
			image: {type: 't', value: null},
			imageOpacity: {type: 'f', value: 1},

			flowType: {type: 'i', value: 0},
			coatOpacity: {type: 'f', value: 0},
			aspect: {type: 'f', value: 1},
			frequency: {type: 'f', value: 2},
			speed: {type: 'f', value: 0},
			seed: {type: 'f', value: 0}
		}

		super({
			fragmentShader: require('../../shaders/brush-pass.frag'),
			uniforms: uniforms
		})

		this.flowManager = new FlowManager(this.uniforms)
		this.flowManager.setSize(w, h)

		this.coatServer = new CoatServer(() => {
			this.uniforms.image.value = this.coatServer.texture
			// this.onDrawCoat()
		})

		// init ping-pong renderer
		let targetOption = {
			// wrapS: THREE.MirroredRepeatWrapping,
			// wrapT: THREE.MirroredRepeatWrapping
			// minFilter: THREE.NearestFilter,
			// magFilter: THREE.NearestFilter
		}

		this.prevTexture = new THREE.WebGLRenderTarget(w, h, targetOption)
		this.texture = new THREE.WebGLRenderTarget(w, h, targetOption)

		this.uniforms.prev.value = this.texture

		// event
		// Interface.on('draw-coat', this.onDrawCoat.bind(this))

		Interface.on('resize', this.onResize.bind(this))
	}

	// onDrawCoat() {
	// 	this.uniforms.imageOpacity.value = 1
	// }

	render() {

		// swap
		let swap = this.prevTexture
		this.prevTexture = this.texture
		this.texture = swap
		this.uniforms.prev.value = this.prevTexture

		super.render(this.texture)

		this.uniforms.imageOpacity.value = 1
	}

	onResize(w, h) {
		this.flowManager.setSize(w, h)
		this.prevTexture.setSize(w, h)
		this.texture.setSize(w, h)
	}

}
