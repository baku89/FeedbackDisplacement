/* global Interface */

/*

Manages uniforms of BrushPass associated with optical flow.

*/

const lerp = require('Interpolation').lerp

import BasePass from './base-pass.js'

const MIN_FLOW = 0.3
const SPEED_AMP = .05

export default class FlowManager {

	constructor(uniforms) {

		this.uniforms = uniforms

		// init speed
		this.volume = MIN_FLOW
		this.speedAmp = 0.3
		this.updateSpeed()

		// type
		Interface.on('flow-type', this.changeFlowType.bind(this))

		// speed
		Interface.on('volume', this.onChangeVolume.bind(this))
		Interface.on('flow-speed', this.onChangeFlowSpeed.bind(this))

		// seed
		Interface.on('change-flow', this.changeFlow.bind(this))
		Interface.on('attack', this.changeFlow.bind(this))
	}

	// type
	changeFlowType(index) {
		this.uniforms.flowType.value = index
	}

	// seed
	changeFlow() {
		this.uniforms.seed.value = Math.random()
	}

	// speed
	onChangeVolume(value) {
		this.volume = value
		this.updateSpeed()
	}
	onChangeFlowSpeed(value) {
		this.speedAmp = value
		this.updateSpeed()
	}
	updateSpeed() {
		this.uniforms.speed.value =
			lerp(MIN_FLOW, 1, Math.pow(this.volume, 3))
			* this.speedAmp
			* SPEED_AMP
	}

	setSize(w, h) {
		this.uniforms.aspect.value = h/ w
	}
}
