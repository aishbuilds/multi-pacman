var state;

initGhostScreen = function(canvas){
	var ctx = initializeCanvas(canvas);

	state = {
		pacmanX: 60,
		pacmanY: 60,
		lastPressedKey: 37,
		pacManDirection: 'left',
		dots: []
	}

	function tickGhostScreen(){
		clear(ctx);
		draw(ctx, state);
		window.requestAnimationFrame(tickGhostScreen);
	}

	window.requestAnimationFrame(tickGhostScreen);
	
}

function updatePacmanInGhostScreen(data){
	state = updatePacmanPositionInGhostScreen(data)
}

function updatePacmanPositionInGhostScreen(data){
	state.pacmanX = data.pacmanX
	state.pacmanY = data.pacmanY
	

	var diff = data.direction == 'right' || data.direction == 'down' ? 2 : -2
	if(data.direction == 'right' || data.direction == 'left'){
		eatDots(state, false, diff)
		state = updatePacmanDirection(state, data.keyCode, data.direction);	
	}
	else{
		eatDots(state, true, diff)
		state = updatePacmanDirection(state, data.keyCode, data.direction);
	}
	return state;
}