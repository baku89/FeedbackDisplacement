
import fs from 'fs'

const ASSET_DIR = './build/assets'
const ASSET_URL = './assets'

export default class CoatServer {

	constructor(onReadyFunc) {

		this.onReadyFunc = onReadyFunc

		this.textureList = []
		this.texture = null

		fs.readdir(ASSET_DIR, (err, files) => {
			if (err) {
				throw err
			}

			let srcList = []

			files.filter((file) => {
				let path = `${ASSET_DIR}/${file}`
				return fs.statSync(path).isFile() && /.*\.(png|jpg)/i.test(path)
			}).forEach((file) => {
				srcList.push(`${ASSET_URL}/${file}`)
			})

			this.loadImages(srcList)
		})
	}

	loadImages(srcList) {

		srcList.forEach((src) => {
			this.textureList.push( new THREE.TextureLoader().load(src) )
		})

		this.texture = this.textureList[0]

		$(window).on('click', this.changeRandom.bind(this))

		this.onReadyFunc(this.texture)
	}

	changeRandom() {

		let index = Math.floor(Math.random() * this.textureList.length)

		console.log(index)

		this.texture = this.textureList[index]

	}

	/*
	gotSources(sourceInfos) {

		// // console.log(sourceInfos)

		// let sourceId = null

		// for (let i = 0; i < sourceInfos.length; i++) {
		// 	let info = sourceInfos[i]
		// 	if (info.label == SOURCE_NAME) {
		// 		sourceId = info.id
		// 		break
		// 	}
		// }

		// const option = {
		// 	video: {
		// 		optional: [
		// 			{sourceId: sourceId}
		// 		]
		// 	}
		// }

		// navigator.getUserMedia(option, this.initUserMedia, () => {})
	}

	initUserMedia(stream) {

		// this.$video = $('.control__coat-source')[0]


		// let onCanplay = () => {
		// 	this.$video.removeEventListener('canplay', onCanplay, true)
		// 	this.$video.play()

		// 	this.texture = new THREE.VideoTexture(this.$video)
		// 	this.texture.minFilter = THREE.LinearFilter
		// 	this.texture.magFilter = THREE.LinearFilter
		// 	this.texture.format = THREE.RGBFormat

		// 	this.onReadyFunc(this.texture)
		// }

		// this.$video.addEventListener('canplay', onCanplay)
		this.$video.src = URL.createObjectURL(stream)
	}*/
}
