import THREE from 'three'
import Stats from 'stats.js'

import Ticker from './ticker'

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

		this.initCanvas()

		$(window).on('resize', this.onResize.bind(this))

		Ticker.on('update', this.update.bind(this))
		Ticker.start()

	}

	initCanvas() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('canvas')
		})

		this.renderer.setClearColor(0x000000)
		this.updateCanvas()

		if (DEBUG) {
			this.stats = new Stats()
			this.stats.setMode(0)

			this.stats.domElement.style.position = 'absolute'
			this.stats.domElement.style.left = '0px'
			this.stats.domElement.style.bottom = '-32px'
			this.stats.domElement.style.background = 'transparent'
			this.stats.domElement.style.color = 'black'

			document.body.appendChild( this.stats.domElement )
		}


	}

	updateCanvas() {
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}


	onResize() {
		this.updateCanvas()
	}

	update() {
		if (DEBUG) this.stats.begin()

		console.log('update')

		if (DEBUG) this.stats.end()
	}

}
