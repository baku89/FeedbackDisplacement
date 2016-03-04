import 'postprocessing/ShaderPass'
import 'postprocessing/MaskPass'
import 'postprocessing/RenderPass'
import 'postprocessing/EffectComposer'

import BrushPass from './brush-pass.js'
import BasePass from './base-pass.js'

class App {

	constructor() {}

	init() {

		this.initScene()
		this.initSource()
	}

	initScene() {

		const w = window.innerWidth
		const h = window.innerHeight

		this.brushPass = new BrushPass()

		this.renderPass = new BasePass({
			canvas: document.getElementById('canvas'),
			width: w,
			height: h,
			fragmentShader: require('./shaders/render.frag'),
			uniforms: {
				texture: {type: 't', value: this.brushPass.texture}
			}
		})

		// let kumiko = new THREE.TextureLoader().load('/assets/kumiko.png')


		window.addEventListener('resize', this.onResize.bind(this))
		window.addEventListener('click', this.onClick.bind(this))

		this.animate = this.animate.bind(this)

		this.onResize()
		this.animate()
	}

	initSource() {
	}

	animate() {
		window.requestAnimationFrame(this.animate)

		this.renderPass.render()
	}

	onResize() {
		const w = window.innerWidth
		const h = window.innerHeight

		// this.plane.setSize(w, h)
		// this.uniforms.resolution.value.set(w, h)
	}

	onClick(e) {
		// this.uniforms.cursor.value.set(e.clientX, e.clientY)
	}


}


new App().init()
