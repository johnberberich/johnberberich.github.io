(function (window, document) {
  var _canvas;
  var _grid;
  var _context;
  var _cellWidth;
  var _cellHeight;

  var autorun = function() {
      _canvas = document.getElementById('canvas');
      _grid = new BerbSoft.Grid(6, 6);
      init();
      render();
  }

  var init = function() {
      if(!_canvas) {
          alert('Error: no canvas!!!');
          return;
      }
      if(!_canvas.getContext) {
          alert('Error: no canvas.getContext!!!');
          return;
      }
      _context = _canvas.getContext('2d');
      if(!_context) {
          alert('Error: failed to canvas.getContext!!!');
          return;
      }
      _cellWidth = _canvas.width / _grid.width;
      _cellHeight = _canvas.height / _grid.height;
      console.log("Context created (canvas=" + _canvas.width + "x" + _canvas.height + ", grid=" + _grid.width + "x" + _grid.height + ")!");

      // Attach event listeners to canvas.
      _canvas.addEventListener('click', onCanvasClicked, false);

      // Set up some defaults for rendering.
      _context.fillStyle = "#0a0";
      _context.strokeStyle= "#000";
      _context.lineWidth = 1;
  }

  var clearDemo = function() {
      _grid.clear();
      render();
  }

  var randomizeDemo = function() {
      _grid.randomize(0, 1);
      render();
  }

  var simulate = function() {
      _grid.conway();
      render();
  }

  var countShapes = function() {
      alert("Not implemented yet.");
  }

  var onCanvasClicked = function(e) {
      var canvasXY = _canvas.relativeMouseCoordinates(e);
      var gridXY = getGridCoordsFromCanvasCoords(canvasXY.x, canvasXY.y);
      toggleCell(gridXY.x, gridXY.y);
      render();
  }

  var relativeMouseCoordinates = function(e) {
      // Function taken from http://stackoverflow.com/a/5932203/121750
      var totalOffsetX = 0;
      var totalOffsetY = 0;
      var canvasX = 0;
      var canvasY = 0;
      var currentElement = this;

      do {
          totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
          totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
      }
      while(currentElement = currentElement.offsetParent);

      canvasX = e.pageX - totalOffsetX;
      canvasY = e.pageY - totalOffsetY;
      return {x:canvasX, y:canvasY};
  }
  HTMLCanvasElement.prototype.relativeMouseCoordinates = relativeMouseCoordinates;

  var getGridCoordsFromCanvasCoords = function(x, y) {
      var x = Math.floor(x / _cellWidth);
      var y = Math.floor(y / _cellHeight);
      return {x:x, y:y};
  }

  var toggleCell = function(x, y) {
      var val = _grid.getValue(x, y);
      val = val > 0 ? 0 : 1;  // toggle
      _grid.setValue(x, y, val);
  }

  var render = function() {
      //BUG: loops only work if outer has >= the elements of inner.
      for(var gy = 0; gy < _grid.width; gy++) {
          for(var gx = 0; gx < _grid.height; gx++) {
              var cx = gx * _cellWidth;
              var cy = gy * _cellHeight;
              var val = _grid.getValue(gx, gy);
              //TODO: If the state of the pixel hasn't changed, don't redraw it.
              _context.strokeRect(cx, cy, _cellWidth, _cellHeight);
              if(val > 0)  {
                  _context.fillRect(cx+1, cy+1, _cellWidth-2, _cellHeight-2);
              } else {
                  _context.clearRect(cx+1, cy+1, _cellWidth-2, _cellHeight-2);
              }
          }
      }
  }

  var randomBetween = function(from, to) {
      return Math.floor(Math.random() * (to - from + 1) + from);
  }

  /*************************/
  /***** EVENT HOOKUPS *****/
  /*************************/
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", autorun, false);
  } else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", autorun);
  } else {
    window.onload = autorun;
  }

})(window, document);