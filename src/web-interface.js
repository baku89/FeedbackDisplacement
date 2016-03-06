import EventEmitter from 'eventemitter3'


class WebInterface extends EventEmitter {

	constructor() {
		super()

		$(window).on({
			keydown: this.onKeydown.bind(this)
		})
	}

	onKeydown() {

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

export default new WebInterface()
