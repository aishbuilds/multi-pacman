var pacmanState;

initGhostScreen = function(canvas){
	var ctx = initializeCanvas(canvas);

	pacmanState = {
		pacmanX: 60,
		pacmanY: 60,
		lastPressedKey: 37,
		pacManDirection: 'left',
		dots: []
	}

	ghostState = {
		ghostX: 120,
		ghostY: 60,
		lastPressedKey: 37,
		ghostDirection: 'left'
	}

	function tickGhostScreen(){
		clear(ctx);
		draw(ctx, pacmanState);
		drawGhost(ctx, ghostState);
		window.requestAnimationFrame(tickGhostScreen);
	}

	window.requestAnimationFrame(tickGhostScreen);
	
}

function updatePacmanInGhostScreen(data){
	pacmanState = updatePacmanPositionInGhostScreen(data)
}

function updatePacmanPositionInGhostScreen(data){
	pacmanState.pacmanX = data.pacmanX
	pacmanState.pacmanY = data.pacmanY
	

	var diff = data.direction == 'right' || data.direction == 'down' ? 2 : -2
	if(data.direction == 'right' || data.direction == 'left'){
		eatDots(pacmanState, false, diff)
		pacmanState = updatePacmanDirection(pacmanState, data.keyCode, data.direction);	
	}
	else{
		eatDots(pacmanState, true, diff)
		pacmanState = updatePacmanDirection(pacmanState, data.keyCode, data.direction);
	}
	return pacmanState;
}

function drawGhost(ctx, ghostState){
	ctx.fillStyle = '#D0342B'
	// Arc of ghost
	ctx.arc(ghostState.ghostX, ghostState.ghostY, 20, 0, 2*Math.PI, false);
	ctx.fill();
}