import EventEmitter from 'eventemitter3'

const FPS = 30
const FRAME_DURATION = 1000.0 / FPS

class Ticker extends EventEmitter {

	constructor() {
		super()
		this.update = this.update.bind(this)
		this.prev = 0
		this.now = 0
	}

	start() {
		console.log('start ticker')
		this.update()
	}

	stop() {
		cancelAnimationFrame(this.requiestId)
	}

	update() {
		this.requestId = requestAnimationFrame(this.update)

		this.now = window.performance.now()

		if (this.now - this.prev >= FRAME_DURATION) {
			this.emit('update')
			this.prev = this.now
		}
	}
}

export default new Ticker()
