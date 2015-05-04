var io;
var gameSocket;

exports.initGame = function(sio, socket){
	io = sio;
	gameSocket = socket;

	// Host Events
	gameSocket.on('pacmanCreateNewGame', pacmanCreateNewGame);
	gameSocket.on('pacmanMoved', pacmanMoved);

	// Ghost Events
	gameSocket.on('ghostJoinedGame', ghostJoinedGame);
	gameSocket.on('ghostMoved', ghostMoved);
	gameSocket.on('gameOver', gameOver);
}

// Host events functions

/*
	The hostCreateNewGame creates a new instance of the game
*/
function pacmanCreateNewGame(){
	var thisGameId = ( Math.random() * 100000 ) | 0;
	this.gameId = thisGameId;
	this.emit('newGameCreated', {gameId: thisGameId, socketId: this.id});
	this.join(thisGameId.toString());
	console.log("Game created with id:" + thisGameId);
}

function pacmanMoved(data){
	this.broadcast.to(this.gameId).emit('updatePacmanMove', data)
}

// Ghost events function
function ghostJoinedGame(data){
	// Look up the room ID in the Socket.IO manager object.
	var room = gameSocket.adapter.rooms[data.gameId];

	console.log("Joined room:" + room)
	if(room != undefined){
		noUsers = Object.keys(room).length
		if(noUsers == 2){
			this.emit('notifyRoomFull', {})
		}
		else{
			io.sockets.in(data.gameId).emit('ghostJoinedRoom', data)
			this.join(data.gameId)
			this.gameId = data.gameId;
			this.emit('initGhostScreen', data)
		}
	}
}

function ghostMoved(data){
	this.broadcast.to(this.gameId).emit('updateGhostMove', data)
}

function gameOver(data){
	io.sockets.in(this.gameId).emit('showGameOver', data)
}