window.AudioContext = window.AudioContext || window.webkitAudioContext
window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia


const SOURCE_NAME = 'Soundflower (2ch)'
// const SOURCE_NAME = 'Default'

export default class AudioAnalyser {

	constructor() {
		this.volume = 0
		this.amp = 1
		this.attack = false
		this._threshold = 0
		this.minInterval = 200
		this.prevTime = 0

		this.$volume = $('.control__volume')
		this.$threshold = $('.control__threshold')

		// call set
		this.threshold = 0.8

		this.initUserMedia = this.initUserMedia.bind(this)
		this.gotSources = this.gotSources.bind(this)

		window.MediaStreamTrack.getSources(this.gotSources)
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
					{sourceId: sourceId}
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
		this.domainData = new Uint8Array(this.analyser.fftSize)

		this.update = this._update
	}

	update() {}

	_update() {

		this.analyser.getByteTimeDomainData(this.domainData)

		// calc average
		let volume = 0.0
		for (let i = 0; i < this.domainData.length; i++) {
			volume = Math.max(volume, this.domainData[i])
		}

		this.volume = (volume / 128.0) - 1.0
		this.volume = Math.min(this.volume * this.amp, 1)

		if (this.attack) {
			this.attack = false
		} else {
			let now = Date.now()
			if (this.volume >= this._threshold && now - this.prevTime > this.minInterval) {
				this.attack = true
				this.prevTime = now
			}
		}

		this.$volume.css({
			scale: [this.volume, 1],
			background: this.attack ? 'red' : 'white'
		})
	}

	get threshold() {
		return this._threshold
	}
	set threshold(value) {
		this._threshold = value
		this.$threshold.css({
			left: `${this._threshold * 100}%`
		})
	}



}
