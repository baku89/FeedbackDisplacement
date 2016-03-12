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

		Interface.on('saturation', (value) => {

			$('#canvas').css('-webkit-filter', `saturate(${value * 3})`)
		})
	}

	render() {
		this.brushPass.render()
		super.render()
	}

}
