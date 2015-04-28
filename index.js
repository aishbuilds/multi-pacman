var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

// Import the game file.
var game = require('./game.js');

app.get('/new', function(req,res){
	res.sendFile(__dirname + '/pacman.html')
});

app.get('/', function(req,res){
	res.sendFile(__dirname + '/pacman.html')
});

io.on('connection', function(socket){
	console.log('a user connected')
	game.initGame(io, socket);
})

http.listen(port, function () {
  console.log('Server listening at port %d', port);
});