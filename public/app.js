
var IO = {
	init: function () {
		IO.socket = io.connect();
		IO.bindEvents();
	},

	bindEvents: function (){
		IO.socket.on('connected', IO.onConnected)
	},

	onConnected: function (){
		App.mySocketId = IO.socket.socket.sessionId;
	}
}

var App = {
	mySocketId: '',

	init: function () {
		App.cacheElements();
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
	},

	Pacman:{
		onCreateClick: function () {
			console.log('Clicked "Create A Game"');
			IO.socket.emit('pacmanCreateNewGame');
		},
	}
}

IO.init();
App.init();