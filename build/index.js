'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();
require('electron-debug')();

var indexFile = __dirname + '/index.html';
if (process.env['NODE_ENV'] == 'dev') {
	indexFile = "http://localhost:9999";
}

var mainWindow = undefined;

function onClosed() {
	mainWindow = null;
}

function createMainWindow() {
	var window = new BrowserWindow({
		width: 600,
		height: 400
	});

	console.log(indexFile);

	if (process.env['NODE_ENV'] == 'dev') {
		window.loadURL('' + indexFile);
	} else {
		window.loadURL('file://' + indexFile);
	}

	window.on('closed', onClosed);

	return window;
}

app.on('windowdow-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', function () {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', function () {
	mainWindow = createMainWindow();
});