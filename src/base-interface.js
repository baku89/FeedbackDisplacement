import EventEmitter from 'eventemitter3'
import AudioAnalyzer from './audio-analyser.js'

export default class BaseInterface extends EventEmitter {

	constructor() {
		super()

		this.audioAnalyzer = new AudioAnalyzer()
	}

	update() {
		this.audioAnalyzer.update()
		this.emit('volume', this.audioAnalyzer.volume)

		if (this.audioAnalyzer.attack) {
			this.emit('attack')
		}
	}
}
