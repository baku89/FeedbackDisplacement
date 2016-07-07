/* global dat */

import Stats from 'stats.js'

import Ticker from './ticker'
import Canvas from './canvas'

const DEBUG = true

export default class App extends Vue {

	constructor() {

		super({
			el: 'body',
			data: {
				flowType: 0,
				flows: require('./shaders/flow').default
			}
		})

		console.log(this.$data.flows)

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

		// init dat.gui
		// this.gui = new dat.GUI()

		this.loader = new THREE.TextureLoader()
		this.loader.load('./assets/sample.png', (texture) => {
			this.canvas.resetByTexture(texture)
		})

		this.canvas = new Canvas()

		this.onChangeFlowType()

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

}
