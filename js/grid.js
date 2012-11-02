var BerbSoft = BerbSoft || {};

/****************/
/***** GRID *****/
/****************/
BerbSoft.Grid = function(width, height) {
	this.width = w;
	this.height = h;
	this.grid = new Array(width * height);
	var that = this;

	var getIndex = function(x, y) {
		return x + this.height * y;
	}

	this.getValue = function(x, y) {
		if(x >= 0 && x < this.width && y >=0 && y < this.height)
			return this.grid[getIndex(x, y)];
		return 0;  // Effectively pads the grid borders with infinite zeros.
	}

	this.setValue = function(x, y, value) {
		this.grid[getIndex(x, y)] = value;
	}
}

BerbSoft.Grid.prototype.clear = function() {
	for(var i = 0; i < this.grid.length; i++) {
		this.grid[i] = 0;
	}
}

BerbSoft.Grid.prototype.randomize = function(min, max) {
	for(var i = 0; i < this.grid.length; i++) {
		this.grid[i] = Math.floor(Math.random() * (max - min + 1) + min);
	}
}

/*****************/
/***** GAMES *****/
/*****************/
BerbSoft.Games = BerbSoft.Games || {};
BerbSoft.Games.Conway = function(grid) {
	var countLivingNeighbors = function(x, y) {
		return this.getValue(y-1,x-1) + this.getValue(y-1,x) + this.getValue(y-1,x+1)
			 + this.getValue(y,x-1) + this.getValue(y,x+1)
			 + this.getValue(y+1,x-1) + this.getValue(y+1,x) + this.getValue(y+1,x+1);
		
	}

	this.step = new function() {
		var newGrid = new Grid(grid.width, grid.height);
		for(var y = 0; y < grid.height; y++) {
			for(var x = 0; x < grid.width; x++) {
				newGrid.setValue(x, y, 0);
			}
		}
	}
	
}
