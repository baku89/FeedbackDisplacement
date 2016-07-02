/* global Interface */

import BasePass from './base-pass.js'
import BrushPass from './brush-pass.js'

export default class RenderPass extends BasePass {

	constructor() {

		const w = window.innerWidth
		const h = window.innerHeight

		let brushPass = new BrushPass(w, h)

		super({
			fragmentShader: require('../../shaders/render-pass.frag'),
			uniforms: {
				texture: {type: 't', value: brushPass.texture},
				saturation: {type: 'f', value: 0}
			}
		})

		this.brushPass = brushPass

		this.$canvas = $('#canvas')
		this.saturation = 0
		this.brightness = 0

		Interface.on('saturation', (value) => {
			this.saturation = value
			this.updateHSB()
		})
		Interface.on('brightness', (value) => {
			this.brightness = value
			this.updateHSB()
		})
	}

	updateHSB() {

		this.$canvas.css(
			'-webkit-filter',
			`saturate(${this.saturation}) brightness(${this.brightness})`)
	}

	render() {
		this.brushPass.render()
		super.render()
	}

}
