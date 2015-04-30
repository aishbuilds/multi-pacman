
var IO = {
	init: function () {
		IO.socket = io.connect();
		IO.bindEvents();
	},

	bindEvents: function (){
		IO.socket.on('connected', IO.onConnected)
		IO.socket.on('newGameCreated', IO.onNewGameCreated)
		IO.socket.on('ghostJoinedRoom', IO.onGhostJoinedRoom)
		IO.socket.on('initGhostScreen', IO.onInitGhostScreen)
		IO.socket.on('updatePacmanMove', IO.updatePacmanMove)
		IO.socket.on('updateGhostMove', IO.updateGhostMove)
		IO.socket.on('showGameOver', IO.showGameOver)
	},

	onConnected: function (){
		App.mySocketId = IO.socket.socket.sessionId;
	},

	onNewGameCreated: function(data){
		App.Pacman.initGame(data)
	},

	onGhostJoinedRoom: function(data){
		App.Pacman.updateWaitingScreen(data)
	},

	onInitGhostScreen: function(data){
		App.Ghost.initGhostScreen(data)
	},

	updatePacmanMove: function(data){
		App.Ghost.updatePacmanMove(data)
	},

	updateGhostMove: function(data){
		App.Pacman.updateGhostMove(data)
	},

	showGameOver: function(data){
		App.showGameOver(data)
	}
}

var App = {
	mySocketId: '',

	gameId: 0,

	noPlayers: 0,

	init: function () {
		App.cacheElements();
		App.showInitScreen();
		App.bindEvents();
	},
	
	cacheElements: function (){
		App.$doc = $(document);

		// Templates
		App.$gameArea = $('#gameArea');
		App.$templateIntroScreen = $('#intro-screen-template').html();
		App.$templateNewGame = $('#create-game-template').html();
		App.$templateJoinGame = $('#join-game-template').html();
		App.$hostGame = $('#host-game-template').html();
		App.$templateGameOver = $('#game-over-template').html();
	},
	
	bindEvents: function () {
		// Pacman events
		App.$doc.on('click', '#btnCreateGame', App.Pacman.onCreateClick);

		// Ghost events
		App.$doc.on('click', '#btnJoinGame', App.Ghost.onJoinClick);
		App.$doc.on('click', '#btnStartGame', App.Ghost.onStartClick);
	},

	showInitScreen: function(){
		App.$gameArea.html(App.$templateIntroScreen)
	},

	displayNewGameScreen: function(){
		App.$gameArea.html(App.$templateNewGame)
		$('#gameId').html(App.gameId)
	},

	gameOver: function(){
		IO.socket.emit('gameOver')
	},

	showGameOver: function(){
		App.$gameArea.html(App.$templateGameOver)
	},

	Pacman:{
		onCreateClick: function () {
			IO.socket.emit('pacmanCreateNewGame');
		},

		initGame: function(data){
			App.gameId = data.gameId;
			App.displayNewGameScreen();
		},

		updateWaitingScreen: function(data){
			$('#waiting').html('Player joined!')
			var canvas = document.getElementById('canvas')
			initCanvasGame(canvas);
		},

		pacmanMoved: function(state, keyCode, direction){
			IO.socket.emit('pacmanMoved', {X: state.X, Y: state.Y, keyCode: keyCode, direction: direction})
		},

		updateGhostMove: function(data){
			updateGhostInPacmanScreen(data);
		}
	},

	Ghost:{
		onJoinClick: function(){
			App.$gameArea.html(App.$templateJoinGame);
		},
		onStartClick: function(){
			data = {
				gameId: $('#inputGameId').val()
			}
			IO.socket.emit('ghostJoinedGame', data)
		},
		initGhostScreen: function(data){
			var canvas = document.getElementById('canvas-ghost')
			initGhostScreen(canvas)
		},
		updatePacmanMove: function(data){
			updatePacmanInGhostScreen(data);
		},

		ghostMoved: function(state, keyCode, direction){
			IO.socket.emit('ghostMoved', {X: state.X, Y: state.Y, keyCode: keyCode, direction: direction})
		}
	}
}

$(document).ready(function(){
	IO.init();
	App.init();
})