var ghostState;

initCanvasGame = function(canvas){
	var ctx = initializeCanvas(canvas);

	var state = {
		X: 60,
		Y: 60,
		lastPressedKey: 37,
		direction: 'left',
		dots: [],
		noDotsEaten: 0
	}

	ghostState = {
		X: 340,
		Y: 220,
		lastPressedKey: 37,
		ghostDirection: 'left'
	}

	window.addEventListener("keydown", function(e){
		state = update(state, e.keyCode)
	})

	function tick(){
		state = update(state, state.lastPressedKey)
		clear(ctx);
		draw(ctx, state);
		drawGhost(ctx, ghostState);
		window.requestAnimationFrame(tick);
	}

	window.requestAnimationFrame(tick);
	
}

function initializeCanvas(canvas){
	canvas.width = config.BOX_WIDTH * config.GRID[0].length
	canvas.height = config.BOX_HEIGHT * config.GRID.length
	return canvas.getContext('2d');
}

function clear(ctx){
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function update(state, keyCode){
	state = updatePacmanPosition(state, keyCode, config.KEY_DIRECTIONS[keyCode], true)
	return state;
}

function updatePacmanPosition(state, keyCode, direction, isPacman){
	var diff = direction == 'right' || direction == 'down' ? 2 : -2
	if(direction == 'right' || direction == 'left'){
		if(moveAllowed(state, 'X', 'Y', direction)){
			state.X += diff
			state = updatePacmanDirection(state, keyCode, direction);
			if(isPacman){
				eatDots(state, false, diff)
				App.Pacman.pacmanMoved(state, keyCode, direction);
			}
			else{
				App.Ghost.ghostMoved(state, keyCode, direction)
			}
		}
	}
	else{
		if(moveAllowed(state, 'Y', 'X', direction)){
			state.Y += diff
			state = updatePacmanDirection(state, keyCode, direction);
			if(isPacman){
				eatDots(state, true, diff)
				App.Pacman.pacmanMoved(state, keyCode, direction);
			}
			else{
				App.Ghost.ghostMoved(state, keyCode, direction)
			}
		}
	}
	return state;
}

function updatePacmanDirection(state, keyCode, direction){
	state.lastPressedKey = keyCode
	state.direction = direction
	return state
}

function draw(ctx, state){
	drawBorder(ctx, state);
	drawDots(ctx, state);
	drawPacman(ctx, state);
}

function drawBorder(ctx, state){
	for(var i=0; i<config.GRID.length-1; i++){
		for(var j=0; j<config.GRID[i].length-1; j++){
			// If the element to the right is not the same, draw a line to the right
			if(config.GRID[i][j] != config.GRID[i][j+1]){
				drawLine(ctx, j*config.BOX_WIDTH, i*config.BOX_WIDTH, true)
			}
			// If the element below is not the same, draw a line below it
			if(config.GRID[i][j]!= config.GRID[i+1][j]){
				drawLine(ctx, j*config.BOX_WIDTH, i*config.BOX_WIDTH, false)
			}
			// Store dots co-ordinates
			if(config.GRID[i][j] == 1){
				storeDotPosition(state, i, j)
			}
		}
	}
}

function drawLine(ctx, xPosition, yPosition, isVertical){
	ctx.strokeStyle = '#0033ff';
	ctx.beginPath();

	if(isVertical){
		ctx.moveTo(xPosition+config.BOX_WIDTH, yPosition);
		ctx.lineTo(xPosition+config.BOX_WIDTH, yPosition+config.BOX_HEIGHT);	
	}
	else{
		ctx.moveTo(xPosition, yPosition+config.BOX_HEIGHT);
		ctx.lineTo(xPosition+config.BOX_WIDTH, yPosition+config.BOX_HEIGHT);
	}

	ctx.stroke();
}

function storeDotPosition(state, i, j){
	dotX = (j*config.BOX_WIDTH) + config.BOX_WIDTH/2
	dotY = (i*config.BOX_WIDTH) + config.BOX_WIDTH/2
	if(!state.dots[dotX + " " + dotY]){
		state.dots[dotX + " " + dotY] = {'x': dotX, 'y': dotY, 'eaten': false}
	}
}

function drawDots(ctx, state){
	for(key in state.dots){
		if(!state.dots[key].eaten){
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(state.dots[key].x, state.dots[key].y,5,5);	
		}		
	}
}

function drawPacman(ctx, state){
	ctx.beginPath();
	ctx.fillStyle = "#f2f000"
	ctx.strokeStyle="#000000"

	// Arc of pacman
	ctx.arc(state.X, state.Y, config.PACMAN.radius, config.PACMAN[state.direction].startAngle, config.PACMAN[state.direction].endAngle, false	)
	
	// Mouth
	ctx.lineTo(state.X + config.PACMAN[state.direction].dMouthX, state.Y+ config.PACMAN[state.direction].dMouthY)
	
	ctx.fill();
	ctx.stroke();
	
	// eyes
	ctx.beginPath();
	ctx.fillStyle = "#000000"
	ctx.arc(state.X + config.PACMAN[state.direction].dEyesX,	state.Y + config.PACMAN[state.direction].dEyesY, 2, 0, Math.PI*2, false)
	ctx.fill();
}

function eatDots(state, isVertical, diff){
	if(isVertical){
		dotY = state.Y + (diff * 4)
		key = state.dots[state.X + " " + dotY]
	}
	else{
		dotX = state.X + (diff * 4)
		key = state.dots[dotX + " " + state.Y]
	}
	
	if(key && !key.eaten){
		key.eaten = true
		state.noDotsEaten += 1
		if(state.noDotsEaten == Object.keys(state.dots).length)
			App.gameOver('Pacman');
	}
}

function moveAllowed(state, wallPosition, adjustPosition, direction){
	neighbors = getNeighbors(state, direction);

	// Stop if a wall is encountered
	if(!checkWall(neighbors, state[wallPosition], neighbors.diff))
		return false

	// Adjust pacman
	adjustPacman(neighbors, state, adjustPosition)
	return true
}

function getNeighbors(state, direction){
	var xIndex = Math.floor(state.X/config.BOX_WIDTH);
	var yIndex = Math.floor(state.Y/config.BOX_WIDTH);
	neighbors = {}

	switch(direction){
		case 'right':
			neighbors.diff = 1
			neighbors.diagonal1 = config.GRID[yIndex + 1][xIndex + 1] //diagonal below
			neighbors.diagonal1 = config.GRID[yIndex - 1][xIndex + 1] //diagonal above
			break;
		case 'left':
			neighbors.diff = -1
			neighbors.diagonal1 = config.GRID[yIndex + 1][xIndex - 1] //diagonal below
			neighbors.diagonal2 = config.GRID[yIndex - 1][xIndex - 1] //diagonal above
			break;
		case 'down':
			neighbors.diff = 1
			neighbors.diagonal1 = config.GRID[yIndex + 1][xIndex - 1] //diagonal Left
			neighbors.diagonal2 = config.GRID[yIndex + 1][xIndex + 1] //diagonal Right
			break;
		case 'up':
			neighbors.diff = -1
			neighbors.diagonal1 = config.GRID[yIndex - 1][xIndex - 1] //diagonal Left
			neighbors.diagonal2 = config.GRID[yIndex - 1][xIndex + 1] //diagonal Right
			break;
	}

	if(direction == 'right' || direction == 'left')
		neighbors.nextBlock = config.GRID[yIndex][xIndex+neighbors.diff]	
	else
		neighbors.nextBlock = config.GRID[yIndex+neighbors.diff][xIndex]	

	neighbors.currentBlock = config.GRID[yIndex][xIndex]
	
	return neighbors
}

function checkWall(neighbors, position, diff){
	if((neighbors.currentBlock != neighbors.nextBlock) && ((position + (diff * config.PACMAN.radius)) % config.BOX_WIDTH == 0)){
		return false;
	}
	return true
}

function adjustPacman(neighbors, state, position){
	if((neighbors.currentBlock != neighbors.diagonal1 || neighbors.currentBlock != neighbors.diagonal2)){
		diff = state[position] % config.BOX_WIDTH
		if(diff < 20 || diff > 20)
			state[position] = (state[position] - (state[position] % config.BOX_WIDTH)) + 20
	}
}

function updateGhostInPacmanScreen(data){
	ghostState.X = data.X
	ghostState.Y = data.Y
	

	var diff = data.direction == 'right' || data.direction == 'down' ? 2 : -2
	if(data.direction == 'right' || data.direction == 'left'){
		ghostState = updatePacmanDirection(ghostState, data.keyCode, data.direction);	
	}
	else{
		ghostState = updatePacmanDirection(ghostState, data.keyCode, data.direction);
	}
	return ghostState;
}
