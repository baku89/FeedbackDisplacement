window.AudioContext = window.AudioContext || window.webkitAudioContext
window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia


const SOURCE_NAME = 'Soundflower (2ch)'
// const SOURCE_NAME = 'Default'

export default class AudioAnalyser {

	constructor() {
		this.volume = 0
		this.initUserMedia = this.initUserMedia.bind(this)

		window.MediaStreamTrack.getSources(this.gotSources.bind(this))
	}

	gotSources(sourceInfos) {

		// console.log(sourceInfos)

		let sourceId = null

		for (let i = 0; i < sourceInfos.length; i++) {
			let info = sourceInfos[i]
			if (info.label == SOURCE_NAME) {
				sourceId = info.id
				break
			}
		}

		const option = {
			audio: {
				optional: [
					{
						sourceId: sourceId
					}
				]
			}
		}

		// let option = {audio: true}

		window.navigator.getUserMedia(option, this.initUserMedia, () => {})
	}

	initUserMedia(stream) {

		let context = new AudioContext()
		let source = context.createMediaStreamSource(stream)

		this.analyser = context.createAnalyser()

		source.connect(this.analyser)
		// this.analyser.connect(context.destination)

		// create data
		this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)

		this.update = this._update


	}

	update() {}

	_update() {

		this.analyser.getByteFrequencyData(this.frequencyData)

		// calc average
		this.volume = this.frequencyData[512]
		// for (let i = 0; i < 1024; i++) {
		// 	// average += this.frequencyData[i]
		// 	this.volume = Math.max(this.volume, this.frequencyData[i])
		// }

		console.log(this.volume)
		this.volume /= 256.0
	}



}
