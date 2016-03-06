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
		this.initSource()
	}

	initScene() {

		const w = window.innerWidth
		const h = window.innerHeight

		this.brushPass = new BrushPass(w, h)

		// make renderer
		this.renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('canvas')
		})
		this.renderer.setClearColor(0x000000)

		this.prevRenderTarget = new THREE.WebGLRenderTarget(w, h, {
		})

		this.brushPass = new BrushPass(this.renderer)

		this.renderPass = new BasePass(this.renderer, {
			renderer: this.renderer,
			fragmentShader: require('./shaders/render-pass.frag'),
			uniforms: {
				texture: {type: 't', value: this.brushPass.texture}
			}
		})

		window.addEventListener('resize', this.onResize.bind(this))
		window.addEventListener('click', this.onClick.bind(this))

		this.animate = this.animate.bind(this)

		this.onResize()

		Ticker.on('update', this.animate.bind(this))
		Ticker.start()
	}

	initSource() {
	}

	animate(elapsed) {

		Interface.update()

		this.brushPass.render()
		this.renderPass.render()
	}

	onResize() {
		const w = window.innerWidth
		const h = window.innerHeight

		this.brushPass.setSize(w, h)
		this.renderPass.setSize(w, h)
	}

	onClick(e) {
		// this.uniforms.cursor.value.set(e.clientX, e.clientY)
	}
}

window.kumiko = new THREE.TextureLoader().load('/assets/kumiko.png', () => {
	new App().init()
})


