/* global dat */

import Stats from 'stats.js'
import radians from 'degrees-radians'

import Ticker from './ticker'
import Canvas from './canvas'
import ImageLoader from './image-loader'
import './directives'

const DEBUG = true


export default class App extends Vue {

	constructor() {

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
		})

		// this.onChangeFlowType = this.onChangeFlowType.bind(this)

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

		this.imageLoader = new ImageLoader()
		this.imageLoader.on('load', (texture) => {
			this.canvas.resetByTexture(texture)
		})

		this.canvas = new Canvas()

		this.onChangeFlowType()
		this.onChangeFlowParameter()

		Ticker.on('update', this._update.bind(this))
		Ticker.start()

	}

	_initKeybind() {
	}

	_update() {
		if (DEBUG) this.stats.begin()

		this.canvas.update()

		if (DEBUG) this.stats.end()
	}

	onChangeFlowType() {
		console.log(this)
		this.canvas.changeFlow( this.$data.flows[ this.$data.flowType ].code )
	}

	onChangeFlowParameter() {
		this.canvas.flowPass.frequency = this.$data.frequency
		this.canvas.flowPass.speed = this.$data.speed
		this.canvas.flowPass.angle = radians(this.$data.angle)
	}

}
