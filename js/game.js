$(document).ready(function () {
  const FPS = 30;
  var bs = 15;
  var bx, by;
  var xv, yv;
  var canvas, context;
  var p1y, p2y;
  var pt, ph;
  var score1, score2;
  var keys = [];

  $.ajax({
    type: "POST",
    url: "/ppsingle/ajax/actions.php",
    data: {
      'action': 'get_players'
    },
    success: function (jsonObject) {
      const newData = jsonObject.map(item => {
        return {
          "id": item.id,
          "text": item.ime + " " + item.prezime
        }
      })
      $(".choice_select_game").select2({
        data: newData,
        width: "50%",
        theme: "classic"
      });
    },
    dataType: "json"
  });

  document.querySelector(".play_button").addEventListener("click", function (e) {
    document.querySelector(".home_box").style.display = "none";
    document.querySelector("#game").style.display = "block";
    // load canvas
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");

    // set up interval (game loop)
    setInterval(update, 1000 / FPS);

    // ball starting position
    bx = canvas.width / 2;
    by = canvas.height / 2;

    p1y = p2y = canvas.height / 2 - 50;
    pt = 10;
    ph = 100;

    score1 = score2 = 0;

    // random ball starting speed
    xv = Math.floor(Math.random() * 76 + 120) / FPS;
    yv = Math.floor(Math.random() * 76 + 120) / FPS;

    function move(e) {
      //alert(e.keyCode);
      if ((e.keyCode === 40) && (p2y + ph / 2 < 549)) p2y += 10;
      if ((e.keyCode === 38) && (p2y + ph / 2 > 59)) p2y -= 10;
      if ((e.keyCode === 83) && (p1y + ph / 2 < 549)) p1y += 10;
      if ((e.keyCode === 87) && (p1y + ph / 2 > 59)) p1y -= 10;
    }

    function whatKey() {
      if (keys[40]) {
        p2y += 0.5;
      }
      if (keys[38]) {
        p2y -= 0.5;
      }
      if (keys[83]) {
        p1y += 0.5;
      }
      if (keys[87]) {
        p1y -= 0.5;
      }
    }

    // random ball direction
    if (Math.floor(Math.random() * 2) == 0) {
      xv = -xv;
    }
    if (Math.floor(Math.random() * 2) == 0) {
      yv = -yv;
    }

    function reset() {
      bx = canvas.width / 2;
      by = canvas.height / 2;
      xv = -xv;
      yv = Math.floor(Math.random() * 76 + 100) / FPS;
      context.fillStyle = "white";
      context.fillRect(0, p1y, pt, ph);
      context.fillRect(canvas.width - pt, p2y, pt, ph);
    }

    function update() {
      whatKey();
      // move the ball
      bx += xv;
      by += yv;

      // bounce the ball off each wall
      if (by + bs > canvas.height || by - bs < 0) {
        yv = -yv;
      }
      if (bx - bs < 0) {
        if (by + bs > p1y && by + bs < p1y + ph) {
          xv = -xv;
          dy = by - (p1y + ph / 2);
        } else {
          score2++;
          reset();
        }
      }
      if (bx + bs > canvas.width) {
        if (by + bs > p2y && by + bs < p2y + ph) {
          xv = -xv;
          dy = by - (p2y + ph / 2);
        } else {
          score1++;
          reset();
        }
      }

      // draw background, ball and pedals
      context.beginPath();
      context.moveTo(canvas.width / 2, 0);
      context.lineTo(canvas.width / 2, canvas.height);
      context.strokeStyle = "red";
      context.stroke();
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "white";
      context.fillRect(0, p1y, pt, ph);
      context.fillRect(canvas.width - pt, p2y, pt, ph);
      context.beginPath();
      context.arc(bx, by, bs, 0, 2 * Math.PI, false);
      context.fillStyle = 'red';
      context.fill();
      context.font = '50px serif';
      context.fillText(score1, 300, 50);
      context.fillText(score2, canvas.width - 300, 50);
    }
    document.onkeydown = move;
  })

})