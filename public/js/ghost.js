var pacmanState;

initGhostScreen = function(canvas){
	var ctx = initializeCanvas(canvas);

	pacmanState = {
		X: 60,
		Y: 60,
		lastPressedKey: 37,
		direction: 'left',
		dots: []
	}

	ghostState = {
		X: 340,
		Y: 220,
		lastPressedKey: 39,
		direction: 'right'
	}

	window.addEventListener("keydown", function(e){
		ghostState = updateGhost(ghostState, e.keyCode)
	})

	function tickGhostScreen(){
		checkGameOver(ghostState, pacmanState)
		ghostState = updateGhost(ghostState, ghostState.lastPressedKey)
		clear(ctx);
		draw(ctx, pacmanState);
		drawGhost(ctx, ghostState);
		window.requestAnimationFrame(tickGhostScreen);
	}

	window.requestAnimationFrame(tickGhostScreen);
	
}

function checkGameOver(ghostState, pacmanState){
	var xDiff = Math.abs(ghostState.X - pacmanState.X)
	var yDiff = Math.abs(ghostState.Y - pacmanState.Y)
	
	if(xDiff >= 0 && xDiff <= 15 && yDiff >= 0 && yDiff <= 15){
		App.gameOver('Ghost');
	}
}
function updateGhost(ghostState, keyCode){
	ghostState = updatePacmanPosition(ghostState, keyCode, config.KEY_DIRECTIONS[keyCode], false)
	return ghostState;
}

function updatePacmanInGhostScreen(data){
	pacmanState = updatePacmanPositionInGhostScreen(data)
}

function updatePacmanPositionInGhostScreen(data){
	pacmanState.X = data.X
	pacmanState.Y = data.Y
	

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
	ctx.arc(ghostState.X, ghostState.Y, 20, 0, 2*Math.PI, false);
	ctx.fill();
}