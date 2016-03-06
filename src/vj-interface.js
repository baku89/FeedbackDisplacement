import EventEmitter from 'eventemitter3'
import OSC from 'node-osc'

import AudioAnalyzer from './audio-analyser.js'



const TYPE = {
	every: 1,
	on: 2
}

const OSCList = {
	'/volume': TYPE.every,
	'/flow-speed': TYPE.every,
	'/overcoat': TYPE.on,
	'/change-flow': TYPE.on
}

class VJInterface extends EventEmitter {

	constructor() {
		super()

		this.oscServer = new OSC.Server(1234, '0.0.0.0')

		this.oscServer.on('message', this.onReceiveOSC.bind(this))

		// this.audioAnalyzer = new AudioAnalyzer()

	}

	update() {
		// this.audioAnalyzer.update()
		// this.emit('volume', this.audioAnalyzer.volume)
	}

	onReceiveOSC(msg, rinfo) {

		let name = msg[0]
		let value = msg[1]

		if (OSCList[name] == TYPE.every) {
			this.emit(name.substr(1), value)
		} else if (OSCList[name] == TYPE.on && value == 1) {
			this.emit(name.substr(1), value)
		}
	}

}



export default new VJInterface()
