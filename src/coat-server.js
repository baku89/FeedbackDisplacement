/* global navigator, URL, MediaStreamTrack */

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
URL = window.URL || window.webkitURL

const SOURCE_NAME = 'CamTwist (7D69:90E0)'

export default class CoatServer {

	constructor(onReadyFunc) {

		this.initUserMedia = this.initUserMedia.bind(this)
		this.gotSources = this.gotSources.bind(this)
		this.onReadyFunc = onReadyFunc

		MediaStreamTrack.getSources(this.gotSources)
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
			video: {
				optional: [
					{sourceId: sourceId}
				]
			}
		}

		navigator.getUserMedia(option, this.initUserMedia, () => {})
	}

	initUserMedia(stream) {

		this.$video = $('.control__coat-source')[0]


		let onCanplay = () => {
			this.$video.removeEventListener('canplay', onCanplay, true)
			this.$video.play()

			this.texture = new THREE.VideoTexture(this.$video)
			this.texture.minFilter = THREE.LinearFilter
			this.texture.magFilter = THREE.LinearFilter
			this.texture.format = THREE.RGBFormat

			this.onReadyFunc(this.texture)
		}

		this.$video.addEventListener('canplay', onCanplay)
		this.$video.src = URL.createObjectURL(stream)
	}
}
