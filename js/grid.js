var BerbSoft = BerbSoft || {};

BerbSoft.Grid = function(width, height, clearVal) {
  this.width = width;
  this.height = height;
  this.clearVal = clearVal;
  this.grid = new Array(this.width * this.height);
  this.clear();

  var that = this;

  var getIndex = function(x, y) {
    return x + that.height * y;
  }

  this.getValue = function(x, y) {
  	var val = this.clearVal;
    if(x >= 0 && x < this.width && y >=0 && y < this.height) {
      var i = getIndex(x, y);
      val = this.grid[i];
    }
    return val;  // Effectively pads the grid borders with infinite zeros.
  }

  this.setValue = function(x, y, val) {
  	var i = getIndex(x, y);
    this.grid[i] = val;
  }
}

BerbSoft.Grid.prototype.clear = function() {
  for(var i = 0; i < this.grid.length; i++) {
    this.grid[i] = this.clearVal;
  }
}

BerbSoft.Grid.prototype.randomize = function(min, max) {
  for(var i = 0; i < this.grid.length; i++) {
    this.grid[i] = Math.floor(Math.random() * (max - min + 1) + min);
  }
}

BerbSoft.Grid.prototype.clone = function() {
  var cloned = new BerbSoft.Grid(this.width, this.height);
  for(var y = 0; y < this.height; y++)
    for(var x = 0; x < this.width; x++)
      cloned.setValue(x, y, this.getValue(x, y));
  return cloned;
}

BerbSoft.Grid.prototype.conway = function() {
  var oldGrid = this.clone();

  var getOldValue = function(x, y) {
    return (oldGrid.getValue(x, y) > 0 ? true : false);
  }

  var countLivingNeighbors = function(x, y) {
    return getOldValue(x-1, y-1) + getOldValue(x-1, y) + getOldValue(x-1, y+1)
         + getOldValue(x,   y-1)                       + getOldValue(x,   y+1)
         + getOldValue(x+1, y-1) + getOldValue(x+1, y) + getOldValue(x+1, y+1);
  }

  var didSurvive = function(x, y) {
	var wasAlive = getOldValue(x, y);

	var numberOfNeighbors = countLivingNeighbors(x, y);
	if(wasAlive) {
	  if(numberOfNeighbors == 2 || numberOfNeighbors == 3)
        return true;  // alive through sustenance
      return false;  // dead via under or overpopulation
	}
    if(numberOfNeighbors == 3)
      return true;  // alive via reproduction
	return false;
  }

  // The update function
  for(var y = 0; y < this.height; y++) {
    for(var x = 0; x < this.width; x++) {
      var survived = didSurvive(x, y);
      this.setValue(x, y, (survived ? 1 : 0));
    }
  }
}
