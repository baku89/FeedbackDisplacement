import EventEmitter from 'eventemitter3'

// const FPS = 40
// const FRAME_DURATION = 1000.0 / FPS

class Ticker extends EventEmitter {

	constructor() {
		super()
		this.update = this.update.bind(this)
		this.prev = 0
		this.now = 0

		// console.log('ticker init')
	}

	setupInterface(Interface) {
		console.log('setup interface in ticker')
		Interface.on('toggle-play', this.togglePlay.bind(this))
	}

	togglePlay(value) {
		if (this.requestId) {
			this.stop()
		} else {
			this.start()
		}
	}

	start() {
		console.log('ticker start')
		this.update()
	}

	stop() {
		console.log('ticker stop')
		cancelAnimationFrame(this.requestId)
		this.requestId = undefined
	}

	update() {
		this.requestId = requestAnimationFrame(this.update)
		this.emit('update')
	}
}

export default new Ticker()
