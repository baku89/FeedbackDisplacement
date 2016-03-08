/* global Stats */

import 'jquery.transit'

import 'postprocessing/ShaderPass'
import 'postprocessing/MaskPass'
import 'postprocessing/RenderPass'
import 'postprocessing/EffectComposer'

import Interface from './vj-interface.js'

import Ticker from './ticker.js'

import BrushPass from './brush-pass.js'
import BasePass from './base-pass.js'

window.Interface = Interface
window.renderer = null

class App {

	constructor() {}

	init() {

		this.initScene()
		this.initHUD()

		Ticker.on('update', this.animate.bind(this))
		Ticker.start()
	}

	initScene() {

		const w = window.innerWidth
		const h = window.innerHeight

		// make renderer
		window.renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('canvas')
		})
		window.renderer.setClearColor(0x000000)

		this.brushPass = new BrushPass(w, h)

		this.renderPass = new BasePass({
			fragmentShader: require('./shaders/render-pass.frag'),
			uniforms: {
				texture: {type: 't', value: this.brushPass.texture}
			}
		})

		window.addEventListener('resize', this.onResize.bind(this))
		window.addEventListener('click', this.onClick.bind(this))

		this.onResize()
	}

	initHUD() {


		this.stats = new Stats()
		this.stats.setMode(0)

		this.stats.domElement.style.position = 'absolute'
		this.stats.domElement.style.left = '0px'
		this.stats.domElement.style.top = '0px'

		// document.body.appendChild( this.stats.domElement )
	}

	animate() {


		this.stats.begin()

		Interface.update()

		this.brushPass.render()
		this.renderPass.render()

		this.stats.end()
	}

	onResize() {
		const w = window.innerWidth
		const h = window.innerHeight

		window.renderer.setSize(w, h)

		this.brushPass.setSize(w, h)
	}

	onClick() {
		// this.uniforms.cursor.value.set(e.clientX, e.clientY)
	}
}

new App().init()


