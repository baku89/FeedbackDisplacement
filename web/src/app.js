/* global dat */

import Stats from 'stats.js'

import Ticker from './ticker'
import Canvas from './canvas'

const DEBUG = true

export default class App extends Vue {

	constructor() {

		console.log('init')

		super({
			el: 'body',
			data: {
				tool: {
					flow: 0
				},
				pref: {
					flows: [
						{name: 'Polar Turbulance', func: 'polarTurb'},
						{name: 'Directional', func: 'directionalDIsp'},
						{name: 'Earthworm', func: 'earthworm'}
					]
				}
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

		// init dat.gui
		this.gui = new dat.GUI()

		this.loader = new THREE.TextureLoader()
		this.loader.load('./assets/sample.png', (texture) => {
			this.canvas.resetByTexture(texture)
		})

		this.canvas = new Canvas()

		Ticker.on('update', this.update.bind(this))
		Ticker.start()

	}


	update() {
		if (DEBUG) this.stats.begin()

		this.canvas.update()

		if (DEBUG) this.stats.end()
	}

}
