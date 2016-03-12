/* global __dirname, process */

const app = require('app')
const BrowserWindow = require('browser-window')

require('crash-reporter').start()
require('electron-debug')()

let indexFile = `${__dirname}/index.html`
if (process.env['NODE_ENV'] == 'dev') {
	indexFile = 'http://localhost:9999'
}

let mainWindow

function onClosed() {
	mainWindow = null
}

function createMainWindow() {
	const window = new BrowserWindow({
		width: 600,
		height: 400
	})

	window.toggleDevTools()

	if (process.env['NODE_ENV'] == 'dev') {
		window.loadUrl(`${indexFile}`)
	} else {
		window.loadUrl(`file://${indexFile}`)
	}


	window.on('closed', onClosed)

	return window
}

app.on('windowdow-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow()
	}
})

app.on('ready', () => {
	mainWindow = createMainWindow()
})
