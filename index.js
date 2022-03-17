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
const step = 1;
let players = [];
io.on('connection', (socket) => {
	userCount++;
	socket.on('add', player => {
		players.push(player);
		console.log(players.length);

		socket.local.emit('newPlayer', players);
		socket.emit('newPlayer', players);
		// console.log('users: ', userCount);
		socket.emit('init', speed, goal, step);

		socket.on('move', (id, x) => {
			socket.broadcast.emit('move', id, x);
		});
	})

	socket.on("disconnect", () => {
		userCount--;
		players.map((player, index) => {
			if (player.id == socket.id) players.splice(index, 1)
		})
		// console.log('user has left. Remaining: ', userCount);
	})
})

http.listen(process.env.PORT || 3000, err => {
	if (err) {
		console.log(err)
		return;
	}
	console.log('listening 3000')
})