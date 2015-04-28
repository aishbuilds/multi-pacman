var io;
var gameSocket;
// var exports = module.exports = {};
exports.initGame = function(sio, socket){
	io = sio;
	gameSocket = socket;

	// Host Events
	gameSocket.on('pacmanCreateNewGame', pacmanCreateNewGame);
}

// Host events functions

/*
	The hostCreateNewGame creates a new instance of the game
*/
function pacmanCreateNewGame(){
	var thisGameId = ( Math.random() * 100000 ) | 0;
	this.emit('newGameCreated', {gameId: thisGameId, socketId: this.id});
	this.join(thisGameId);
	console.log("Game joined with id:" + thisGameId);
}