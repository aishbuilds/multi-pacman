
var IO = {
	init: function () {
		IO.socket = io.connect();
		IO.bindEvents();
	},

	bindEvents: function (){
		IO.socket.on('connected', IO.onConnected)
		IO.socket.on('newGameCreated', IO.onNewGameCreated)
		IO.socket.on('ghostJoinedRoom', IO.onGhostJoinedRoom)
	},

	onConnected: function (){
		App.mySocketId = IO.socket.socket.sessionId;
	},

	onNewGameCreated: function(data){
		App.Pacman.initGame(data)
	},

	onGhostJoinedRoom: function(data){
		App.Pacman.updateWaitingScreen(data)
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
	},
	
	bindEvents: function () {
		// Host
		App.$doc.on('click', '#btnCreateGame', App.Pacman.onCreateClick);
		App.$doc.on('click', '#btnJoinGame', App.Ghost.onJoinClick);
		App.$doc.on('click', '#btnStartGame', App.Ghost.onStartClick);
	},

	showInitScreen: function(){
		App.$gameArea.html(App.$templateIntroScreen)
	},

	displayNewGameScreen: function(){
		App.$gameArea.html(App.$templateNewGame)
		console.log(App.gameId)
		$('#gameId').html(App.gameId)
	},

	Pacman:{
		onCreateClick: function () {
			console.log('Clicked "Create A Game"');
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
		}
	},

	Ghost:{
		onJoinClick: function(){
			console.log('Clicked "Join a game"');
			App.$gameArea.html(App.$templateJoinGame);
		},
		onStartClick: function(){
			data = {
				gameId: $('#inputGameId').val()
			}
			IO.socket.emit('ghostJoinedGame', data)
		}
	}
}

$(document).ready(function(){
	IO.init();
	App.init();
})