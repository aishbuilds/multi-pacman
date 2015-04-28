var config = {
	GRID: [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
		[0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0],
		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
		[0,1,0,0,1,0,1,1,0,0,0,1,1,0,1,0,0,1,0],
		[0,1,1,1,1,0,0,1,1,0,1,1,0,0,1,1,1,1,0],
		[0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0],
		[0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0],
		[0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,1,1,0],
		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	],
	BOX_WIDTH: 40,
	BOX_HEIGHT: 40,
	PACMAN:{
		radius: 20,
		'right':{
			startAngle: Math.PI*0.25,
			endAngle: Math.PI*1.75,
			dMouthX: 2,
			dMouthY: 0,
			dEyesX: 2,
			dEyesY: -10
		},
		'left':{
			startAngle: Math.PI*1.25,
			endAngle: Math.PI*0.75,
			dMouthX: 2,
			dMouthY: 0,
			dEyesX: 2,
			dEyesY: -10
		},
		'up':{
			startAngle: Math.PI*1.75,
			endAngle: Math.PI*1.25,
			dMouthX: 0,
			dMouthY: -2,
			dEyesX: 8,
			dEyesY: 2
		},
		'down':{
			startAngle: Math.PI*0.75,
			endAngle: Math.PI*0.25,
			dMouthX: 0,
			dMouthY: 2,
			dEyesX: -8,
			dEyesY: -2
		}
	},
	KEY_DIRECTIONS:{
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	}
}