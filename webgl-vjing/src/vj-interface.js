import OSC from 'node-osc'
import BaseInterface from './base-interface.js'

const TYPE = {
	every: 1,
	on: 2
}

const OSCList = {
	'/volume': TYPE.every,
	'/flow-speed': TYPE.every,
	'/draw-coat': TYPE.on,
	'/change-flow': TYPE.on,
	'/flow-type': TYPE.every,
	'/saturation': TYPE.every,
	'/brightness': TYPE.every,
	'/opacity': TYPE.every,
	'/toggle-play': TYPE.every,
	'/audio-amp': function(value) {
		this.audioAnalyzer.amp = value
	},
	'/attack-threshold': function(value) {
		this.audioAnalyzer.threshold = value
	}
}

class VJInterface extends BaseInterface {

	constructor() {
		super()

		// console.log('vj-interface init')

		this.oscServer = new OSC.Server(1234, '0.0.0.0')
		this.oscServer.on('message', this.onReceiveOSC.bind(this))

		global.sharedObject = {}

		// if (!global.sharedObject.controlWindow) {
		// 	const BrowserWindow = remote.require('browser-window')
		// 	let controlWindow = new BrowserWindow({})
		// }
	}


	onReceiveOSC(msg) {

		let name = msg[0]
		let value = msg[1]

		// console.log(name, value)

		if (OSCList[name] == TYPE.every) {
			this.emit(name.substr(1), value)
		} else if (OSCList[name] == TYPE.on && value == 1) {
			this.emit(name.substr(1), value)
		} else if (typeof OSCList[name] == 'function') {
			OSCList[name].call(this, value)
		}
	}

}



export default new VJInterface()
