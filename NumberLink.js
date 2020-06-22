/**************************************

	Number Link Solver
	
	Paul Matthews
	
	22.06.2020

**************************************/

var fs = require('fs'),		// Used for file operations
	md5 = require('md5');	// Used for performing md5 hashes on the boards

// List of partially solved boards
let boards = [];

// Used for tracking the number of solved boards
let passed = {};

// Used for tracking which boards of a given size could not be solved
let failed = {};

// Create a new board instance based on a board design
function newBoard(b) {
	var bx = b.size.x;	// size of the board in x-axis
	var by = b.size.y;	// size of the board in y-axis
	
	// Iniatlize the board (to empty)
	var board = new Array(by).fill('.').map(() => new Array(bx).fill('.'));
	var points = b.points;
	
	// Fill with path endpoints
	Object.keys(points).forEach(function(key) {
		var k = points[key];
		board[k[0][1]][k[0][0]] = key;
		board[k[1][1]][k[1][0]] = key;
	})
	b.board = board;
	
	return b;
}

// Get the hash of a board (so that we can ensure we're only storing unique boards)
function getBoardHash(board) {
	return md5(JSON.stringify(board));
}

// For a given heading {0:Up, 1:Left, 2:Down, 3:Right}
// rotate either clockwise (-1), or anticlockwise (1)
function rotate(heading, turnDirection) {
	heading += turnDirection;
	if (heading == 4) heading = 0;
	else if (heading == -1) heading = 3;	
	
	return heading
}

// For a given board, return how many moves can be made from a given cell (0 to 4)
function availableMoves(board, x, y) {
	var b = board.board;
	var c = 0;
	
	if ((x > 0) && (b[y][x - 1] === '.')) c++;					// Check Left
	if ((y > 0) && (b[y - 1][x] === '.')) c++;					// Check Up
	if ((x < board.size.x - 1) && (b[y][x + 1] === '.')) c++	// Check Right
	if ((y < board.size.y - 1) && (b[y + 1][x] === '.')) c++;	// Check Down
	
	return c;	
}

// Perform a left (side = 1) or right (side = -1) wall follow on the 'board', starting at
// 'start' and ending at 'end'
function wallFollow(board, side, start, end, color) {
	var validPaths = [];
	var validPaths = [];
	var sx = board.size.x;
	var sy = board.size.y;
	
	//Left-hand Follower
	var dir = 0;	// 0 = Up, 1 = Left, 2 = Down, 3 = Right
	var [x, y] = start;
	var stuck = false;
	var solved = false;
	
	var boardCopy = JSON.parse(JSON.stringify(board))
	var b = boardCopy.board;

	while ((stuck === false) && (solved === false)) {
		//console.log(x, y, dir, side, color, availableMoves(boardCopy, x, y));
		//console.log(board.board);
		if (((x < sx - 1) && (x + 1 === end[0]) && (y === end[1])) ||
			((y < sy - 1) && (x === end[0]) && (y + 1 === end[1])) ||
			((x > 0) && (x - 1 === end[0]) && (y === end[1])) ||
			((y > 0) && (x === end[0]) && (y - 1 === end[1]))) solved = true;
		else if (availableMoves(boardCopy, x, y) === 0 || availableMoves(boardCopy, x, y) === 4) stuck = true;
		else {
			switch(dir) {
				case 0:	// Up
					if ((side === 1 && (x === 0 || b[y][x - 1] !== '.')) || (side === -1 && (x === sx - 1 || b[y][x + 1] !== '.'))) {
						if (y === 0 || b[y - 1][x] != '.') dir = rotate(dir, -side);
						else boardCopy.board[--y][x] = color;
					} else dir = rotate(dir, side);
					break;
				case 1:	// Left
					if ((side === 1 && (y === sy - 1 || b[y + 1][x] != '.')) || (side === -1 && (y === 0 || b[y - 1][x] != '.'))) {
						if (x === 0 || b[y][x - 1] !== '.') dir = rotate(dir, -side);
						else boardCopy.board[y][--x] = color;
					} else dir = rotate(dir, side);
					break;					
				case 2: // Down
					if ((side === 1 && (x === sx - 1 || b[y][x + 1] !== '.')) || (side === -1 && (x === 0 || b[y][x - 1] != '.'))) {
						if (y === sy - 1 || b[y + 1][x] !== '.') dir = rotate(dir, -side);
						else boardCopy.board[++y][x] = color;
					} else dir = rotate(dir, side);
					break;
				case 3: // Right
					if ((side === 1 && (y == 0 || b[y - 1][x] !== '.')) || (side === -1 && (y === sy - 1 || b[y + 1][x] != '.'))) {
						if (x === sx - 1 || b[y][x + 1] !== '.') dir = rotate(dir, -side);
						else boardCopy.board[y][++x] = color;
					} else dir = rotate(dir, side);
					break;
			}
			
		} 	
	}
	if (solved) {
		delete boardCopy.points[color];
		validPaths.push(boardCopy);
	}
	
	return validPaths;
}

// For a given pair of endpoints on a board, check A-B and B-A perform a left and right hand wall follow
function findPath(board, endPoints, color) {
	var validPaths = [];
		
	//Left-hand Follower
	validPaths.push(...wallFollow(board, 1 /*left*/, endPoints[0], endPoints[1], color)); // A to B following left wall
	validPaths.push(...wallFollow(board, 1 /*left*/, endPoints[1], endPoints[0], color)); // B to A following left wall

	//Right-hand Follower
	validPaths.push(...wallFollow(board, -1 /*right*/, endPoints[0], endPoints[1], color)); // A to B following right wall
	validPaths.push(...wallFollow(board, -1 /*right*/, endPoints[1], endPoints[0], color)); // B to A following right wall

	return validPaths;
}

// Check is a given board is solved
function isSolved(board) {	
	var solved = true;
	
	for (var c = 0; c < board.length; c++) {
		for (var d = 0; d < board[c].length; d++) {
			if (board[c][d] === '.') {	// Check is any cells are not on an assigned path
				solved = false;
				break;
			}
		}
		if (solved === false) break;
	}
	
	return solved;
}

// For a given board (b), with endpoints listed within, solve it
function solveBoard(b) {
	var stack = {};							// Our in-work boards reside here
	var maxStackSize = 0;					// Keep track of how many partial boards we are juggling	
	var h = getBoardHash(b);				// Unique hash of the board to be solved
	stack[h] = b;							// Load the unsolved board to the stack
	console.log("Unsolved:\n", b.board);
	
	var done = false;
	while(!done) {
		for (const [hash, board] of Object.entries(stack)) {					
			for (const [color, endPoints] of Object.entries(stack[hash].points)) {
				var boardsWithPath = findPath(stack[hash], endPoints, color);

				for (boardWithPath in boardsWithPath) {
					var bWP = boardsWithPath[boardWithPath];
					h = getBoardHash(bWP);
					
					// Only add board tothe stack if it is unique
					if (!(h in stack)) {
						// check for trapped endpoints
						var blockedOtherEndPoint = false;
						for (point in bWP.points) {
							if (availableMoves(bWP, bWP.points[point][0][0], bWP.points[point][0][1]) === 0 ||
								availableMoves(bWP, bWP.points[point][1][0], bWP.points[point][1][1]) === 0) {
									blockedOtherEndPoint = true;
									break;
							}
						}
						
						if (blockedOtherEndPoint === false) stack[h] = bWP;
					}
				}
			}
			var l = Object.keys(stack).length;
			if (l > 1) {
				delete stack[hash]; // Delete the old board
				if (l > maxStackSize) maxStackSize = l;
			} else {
				done = true;
			}
		}
	}
	
	// Is is solved 
	var k = Object.keys(stack);
	var _board = stack[k[0]];
	if (isSolved(_board.board)) {
		console.log("Solved:\n", _board.board);
		console.log("Maximimum board stack size during computation: ", maxStackSize);
		if (!(_board.size.x in passed)) passed[_board.size.x] = 0;
		passed[_board.size.x]++;
	} else {
		console.log("I got Stuck\n");
		if (!(_board.size.x in failed)) failed[_board.size.x] = [];
		failed[_board.size.x].push(_board.level);
	}
}

// Convert a cell number (i.e. 0-24 on a 5x5 board) to x,y coords
function cellToCoord(cell, sx, sy) {
	return [cell % sx, ((cell - cell % sx) / sx) | 0];
}

// Load a levels file and all the boards it contains
function loadLevels(file) {
	var lines = fs.readFileSync(file, 'utf8').split('\n');
	
	lines.forEach(line => {
		line.trim();
		if (line.length !== 0) {
			var lineData = line.split(';');

			var paths = [];
			lineData.forEach(data => {
				paths.push(data.split(',').map(x =>+x));
			});
			var [size, unknown, level, numPaths] = paths.shift();

			var board = {};
			board.size = { x: size, y: size};
			board.level = level;
			board.points = {};
			for (var c = 0; c < paths.length; c++) {
				var startCell = paths[c][0];
				var endCell = paths[c][paths[c].length - 1];
				board.points[c] = [cellToCoord(startCell, size, size), cellToCoord(endCell, size, size)];
			}
			
			boards.push(board);
		}
	});

}

// Read in a levels file, solve all the boards within it
function main(done) {
	var path = process.argv[process.argv.length - 1];
	console.log("Opening: ", path);

	if (fs.existsSync(path)) {
		loadLevels(path);
			
		var start = new Date();
		for (var c = 0; c < boards.length; c++) {
			console.log("Board ", c + 1, ":");
			var board = newBoard(boards[c]);
			solveBoard(board);
		};
		
		var end = new Date() - start;
		console.info('Execution time: %dms', end);
		
		console.log("Statistics:");
		var total = 0;
		for(c = 5; c < 10; c++) {
			console.log(c, 'x', c, 'board has ', passed[c], '/ 30 solutions found');
			total += passed[c];
		}
		console.log("Total Solutions:", total, "/ ", boards.length);
		
		console.log("Failed:");
		var total = 0;
		for(c = 5; c < 10; c++) {
			console.log(c, 'x', c, 'failures: ', failed[c]);
		}
	} else {
		console.error("File does not exist");
	}
}

main();

