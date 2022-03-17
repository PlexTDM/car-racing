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
io.on('connection', (socket) => {
	userCount++;
	console.log('users: ', userCount);
	socket.on('move', (player, x) => {
		// socket.broadcast.emit('move', player, x);
		socket.broadcast.emit('move', player, x);
	});
	socket.on("disconnecting", () => {
		userCount--
		for (const room of socket.rooms) {
			if (room !== socket.id) {
				socket.to(room).emit("user has left. Remaining: ", userCount);
			}
		}
	})
})

http.listen(process.env.PORT || 3000, err => {
	if (err) {
		console.log(err)
		return;
	}
	console.log('listening 3000')
})