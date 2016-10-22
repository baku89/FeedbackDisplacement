/* global dat */

import Stats from 'stats.js'
import radians from 'degrees-radians'

import Canvas from './canvas'
import ImageLoader from './image-loader'
import './directives'

import './ctrl'

const DEBUG = true

export default class App extends Vue {

	constructor() {

		/*
		super({
			el: 'body',
			data: {
				flowType: 0,
				frequency: 2,
				speed: 0.001,
				angle: 0,
				offset: {x: 0, y: 0},

				flows: require('./shaders/flow').default
			}
		})*/

		super({
			el: 'body',
			data: {
				programs: ['One', 'Two', 'Three'],
				unifromParams: [
					{type: 'range', name: 'frequency', label: 'FREQUENCY', value: 2, min: 0, max: 10},
					{type: 'range', name: 'speed', label: 'SPEED', value: 0.001, min: 0, max: 0.1},
					{type: 'angle', name: 'angle', label: 'ANGLE', value: 0},
					{type: 'offset2d', name: 'offset', label: 'OFFSET', value: {x: 0, y: 0}}
				]
			}
		})

		if (DEBUG) {
			this.stats = new Stats()
			this.stats.setMode(0)
			this.stats.domElement.style.position = 'absolute'
			this.stats.domElement.style.left = 'auto'
			this.stats.domElement.style.right = '0px'
			this.stats.domElement.style.bottom = '0px'
			this.stats.domElement.style.top = 'auto'
			this.stats.domElement.style.background = 'transparent'
			this.stats.domElement.style.color = 'black'
			document.body.appendChild( this.stats.domElement )
		}

		/*
		this.imageLoader = new ImageLoader()
		this.imageLoader.on('load', (texture) => {
			this.canvas.resetByTexture(texture)
		})
		*/

		this.canvas = new Canvas()

		// this._onChangeFlowType()
		// this._onChangeFlowParameter()
		//
	}

	/*
	_initKeybind() {
	}
	*/

	/*
	_onChangeCode() {
		this.canvas.changeCode( this.$data.programs[ this.$data.programName ].code )
	}

	_onChangeFlowParameter() {
		this.canvas.flowPass.frequency = this.$data.frequency
		this.canvas.flowPass.speed = this.$data.speed
		this.canvas.flowPass.angle = radians(this.$data.angle)
	}*/

}
