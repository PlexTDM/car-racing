const express = require('express');
const server = express();
const http = require('http').Server(server);
const path = require('path');
const io = require('socket.io')(http);
require('dotenv/config');

server.use('/static', express.static(path.join(__dirname, 'public')))

server.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/canvas.html'))
})

server.get('/test', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/socket.html'))
})
let userCount = 0;
const speed = 20;
const goal = 450;
const step = 0.5;
io.on('connection', (socket) => {
	userCount++;
	console.log('users: ', userCount);
	socket.emit('init', speed, goal);
	socket.on('move', (player, x) => {
		socket.broadcast.emit('move', player, x, step);
	});
	socket.on("disconnecting", () => {
		userCount--;
		console.log('user has left. Remaining: ', userCount);
	})
})

http.listen(process.env.PORT || 3000, err => {
	if (err) {
		console.log(err)
		return;
	}
	console.log('listening 3000')
})