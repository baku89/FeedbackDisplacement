/* global Stats */

import 'jquery.transit'

import 'postprocessing/ShaderPass'
import 'postprocessing/MaskPass'
import 'postprocessing/RenderPass'
import 'postprocessing/EffectComposer'

import Interface from './vj-interface.js'

import Ticker from './ticker.js'

import RenderPass from './render-pass.js'

window.Interface = Interface
window.renderer = null

class App {

	constructor() {}

	init() {

		this.initRenderer()
		this.initScene()
		this.initHUD()

		Ticker.setupInterface(window.Interface)

		Ticker.on('update', this.animate.bind(this))
		Ticker.start()
	}

	initRenderer() {
		// make renderer
		window.renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('canvas')
		})
		window.renderer.setClearColor(0x000000)
		window.renderer.setSize(window.innerWidth, window.innerHeight)

		Interface.on('resize', (w, h) => {
			window.renderer.setSize(w, h)
		})
	}

	initScene() {

		this.renderPass = new RenderPass()
	}

	initHUD() {

		this.stats = new Stats()
		this.stats.setMode(0)

		this.stats.domElement.style.position = 'absolute'
		this.stats.domElement.style.left = '0px'
		this.stats.domElement.style.bottom = '-32px'
		this.stats.domElement.style.background = 'transparent'
		this.stats.domElement.style.color = 'black'

		document.body.appendChild( this.stats.domElement )
	}

	animate() {
		this.stats.begin()

		Interface.update()

		this.renderPass.render()

		this.stats.end()
	}
}

new App().init()


