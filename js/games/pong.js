(function(window, document) {

  function Player(name, keyState) {
    this.name = name;
    this.keyState = keyState;
    this.top = 0;
    this.height = 50;
    this.velocity = 5.0;  // Maybe change with player handicap.
    this.isDirty = true;
    this.oldTop = this.top;
  }

  function Ball() {
    this.pos = { 'x': 100, 'y': 100 };
    this.oldPos = { 'x': 100, 'y': 100 };
    this.size = 8;
    this.velocity = { 'x': 5.0, 'y': 3.0 };
  }

  function Pong(board, players) {

    function updatePlayer(player, elapsed) {
      // 1) Determine if the player moved and by how much.
      var dist = Math.round(player.velocity * elapsed);
      var dir = 0;
      if((player.keyState.up === 1) && (player.keyState.down === 0) && (player.top > 0)) {
        dir = -1;
        var distFromTop = player.top - 0;
        if(dist > distFromTop) {
          dist = distFromTop;
        }
      } else if((player.keyState.down === 1) && (player.keyState.up === 0) && ((player.top + player.height) < boardHeight)) {
        dir = 1;
        var distFromBottom = boardHeight - (player.top + player.height);
        if(dist > distFromBottom) {
          dist = distFromBottom;
        }
      }

      // 2) Did the player collide with anything (e.g., the walls)?


      // Update the player's position.
      if(dir !== 0) {
        player.oldTop = player.top;
        player.top += dist * dir;
        player.isDirty = true;
        console.log('move(' + player.name + ', dir=' + dir + ', dist=' + dist + ', oldTop=' + player.oldTop + ', newTop=' + player.top + ')');
      } else {
        player.isDirty = false;
      }
    }

    function updateBall(elapsed) {
      ball.oldPos.x = ball.pos.x;
      ball.oldPos.y = ball.pos.y;
      ball.pos.x += Math.round(ball.velocity.x * elapsed);
      ball.pos.y += Math.round(ball.velocity.y * elapsed);
    }

    function drawWalls() {
      var wallWidth = 6;
      var wallPadding = Math.ceil(wallWidth/2);
      ctx.lineWidth = wallWidth;

      ctx.beginPath();
      ctx.moveTo(0, wallPadding);  // Top wall
      ctx.lineTo(boardWidth, wallPadding);
      ctx.moveTo(0, boardHeight-wallPadding);  // Bottom wall
      ctx.lineTo(boardWidth, boardHeight-wallPadding);
      ctx.stroke();
    }

    function drawNet() {
      var netWidth = 6;
      var centerX = boardWidth / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, boardHeight);
      ctx.stroke();
    }

    function drawPlayer(player, x0) {
      if(player.isDirty) {
        ctx.clearRect(x0, player.oldTop, 8, player.height);
        ctx.fillRect(x0, player.top, 8, player.height);
      }
    }

    function drawBall() {
      ctx.clearRect(ball.oldPos.x, ball.oldPos.y, ball.size, ball.size);
      ctx.fillRect(ball.pos.x, ball.pos.y, ball.size, ball.size);
    }

    function update(elapsed) {
      updateBall(elapsed);
      updatePlayer(player1, elapsed);
      updatePlayer(player2, elapsed);
    }

    function render() {
      //ctx.clearRect(0, 0, boardWidth, boardHeight);
      drawNet();
      drawPlayer(player1, 0);
      drawPlayer(player2, 312);
      drawBall();
    }

    this.init = function() {
      // Start the ball off from the center
      drawWalls();
      drawNet();
      drawPlayer(player1, 0);
      drawPlayer(player2, 312);
      drawBall();
    };

    this.run = function() {
      var elapsed = 0.5;
      update(elapsed);
      render();
    };

    var ctx = board.context;
    var boardWidth = board.width;
    var boardHeight = board.height;
    var player1 = players[0];
    var player2 = players[1];
    var ball = new Ball();
    var that = this;
  }

  function getGameBoard(d, canvas_id) {
    var canvas = d.getElementById(canvas_id);
    if(!canvas) {
      console.error('Error: no canvas!!!');
      return;
    }
    if(!canvas.getContext) {
      console.error('Error: no canvas.getContext!!!');
      return;
    }
    var context = canvas.getContext('2d');
    if(!context) {
      console.error('Error: failed to canvas.getContext!!!');
      return;
    }
    return { 'width': canvas.width, 'height': canvas.height, 'context': context };
  }

  var ONE_FRAME_TIME = 1000 / 60;

  var pong = {};
  var input = { 'p1': { 'up': 0, 'down': 0 }, 'p2': { 'up': 0, 'down': 0 } };

  function autorun() {
    var board = getGameBoard(document, 'canvas');
    var players = [new Player('john', input.p1), new Player('chris', input.p2)];
    pong = new Pong(board, players);
    pong.init();
    setInterval(pong.run, ONE_FRAME_TIME);
  }

  function onkey(e, val) {
    var keyCode = e.keyCode || e.charCode;
    switch(keyCode) {
      case 65:  // "a" = p1 move up
        input.p1.up = val;
        break;
      case 90:  // "z" = p1 move down
        input.p1.down = val;
        break;
      case 75:  // "k" = p2 move up
        input.p2.up = val;
        break;
      case 77: // "m" = p2 move down
        input.p2.down = val;
        break;
    }
  }
  function onkeydown(e) {
    onkey(e, 1);
  }
  function onkeyup(e) {
    onkey(e, 0);
  }


  /***** EVENT HOOKUPS *****/
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", autorun, false);
    document.addEventListener("keydown", onkeydown, false);
    document.addEventListener("keyup", onkeyup, false);
  } else if (document.attachEvent) {
    console.log("Ancient browser");
    document.attachEvent("onreadystatechange", autorun);
    //document.attachEvent("onkeydown", attachEvent_keydown);
    //document.attachEvent("onkeyup", attachEvent_keyup);
  } else {
    console.log("Prehistoric browser");
    window.onload = autorun;
    //window.onkeydown = onkeypress_keydown;
    //window.onkeyup = onkeypress_keyup;
  }

})(window, document);
