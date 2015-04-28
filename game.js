var io;
var gameSocket;
// var exports = module.exports = {};
exports.initGame = function(sio, socket){
	io = sio;
	gameSocket = socket;

	// Host Events
	gameSocket.on('pacmanCreateNewGame', pacmanCreateNewGame);
	gameSocket.on('ghostJoinedGame', ghostJoinedGame);
}

// Host events functions

/*
	The hostCreateNewGame creates a new instance of the game
*/
function pacmanCreateNewGame(){
	var thisGameId = ( Math.random() * 100000 ) | 0;
	this.emit('newGameCreated', {gameId: thisGameId, socketId: this.id});
	this.join(thisGameId.toString());
	console.log("Game created with id:" + thisGameId);
}

function ghostJoinedGame(data){
	// Look up the room ID in the Socket.IO manager object.
	var room = gameSocket.adapter.rooms[data.gameId];

	console.log("Joined room:" + room)
	if(room != undefined){
		this.join(data.gameId)
		io.sockets.in(data.gameId).emit('ghostJoinedRoom', data)
	}
}