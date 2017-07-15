'use strict';

const electron = require('electron');
const spawn = require('child_process').spawn
const app = electron.app;
var http = require('http')
var server = null
const event = require('./app/js/events')

const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('ready', function(){
	mainWindow = new BrowserWindow({
		width: 800,
		height: 480
	})

	mainWindow.loadURL('file://'+__dirname+'/app/index.html')

	mainWindow.webContents.once("did-finish-load", function(){
		server = http.createServer()
		var io = require('socket.io')(server);
		server.listen(8080)
		event.emit("up")
		console.log("listening server port 8080")
		io.on('connection', function(socket){
			console.log('a user connected')

			socket.on("msg", function(data){
				console.log(data);
			})

			socket.on("gif", function(data){
				console.log('got gif to emit')
				socket.broadcast.emit("gif",data)
			})
		})

	})

	if(process.platform == 'darwin'){
		mainWindow.webContents.openDevTools();
	} else {
		// for full screen on pi
		mainWindow.webContents.openDevTools();
		//mainWindow.setMenu(null);
		//mainWindow.setFullScreen(true);
		//mainWindow.maximize();
	}

})

app.on('window-all-closed', function(){
	app.quit();
})