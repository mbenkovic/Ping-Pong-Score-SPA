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

  document.querySelector("#single_game").addEventListener("click", function (e) {
    let id1 = $('#choice_p1_game').select2('data')[0].id;
    let id2 = $('#choice_p2_game').select2('data')[0].id;
    if (id1 === id2) {
      alert('Choose different players!');
    } else {
      document.querySelector(".home_box_rules").style.display = "block";
      document.querySelector(".home_box").style.display = "none";
      document.querySelector("#game").style.display = "block";

      // load canvas
      canvas = document.getElementById("game");
      context = canvas.getContext("2d");

      // set up interval (game loop)
      var gameLoopInterval = setInterval(update, 1000 / FPS);

      // ball starting position
      bx = canvas.width / 2;
      by = canvas.height / 2;

      p1y = p2y = canvas.height / 2 - 50;
      pt = 10;
      ph = 100;

      score1 = score2 = 0;

      // random ball starting speed
      xv = Math.floor(Math.random() * 76 + 220) / FPS;
      yv = Math.floor(Math.random() * 76 + 220) / FPS;

      function whatKey() {
        if (keys[40] && p2y + ph / 2 < 549) {
          p2y += 10;
        }
        if (keys[38] && p2y + ph / 2 > 59) {
          p2y -= 10;
        }
        if (keys[83] && p1y + ph / 2 < 549) {
          p1y += 10;
        }
        if (keys[87] && p1y + ph / 2 > 59) {
          p1y -= 10;
        }
      }

      // random ball direction
      if (Math.floor(Math.random() * 2) == 0) {
        xv = -xv;
      }
      if (Math.floor(Math.random() * 2) == 0) {
        yv = -yv;
      }

      function sendResult(s1, s2) {
        let winnerid = $('#choice_p1_game').select2('data')[0].id;
        if (s1 < s2) {
          winnerid = $('#choice_p2_game').select2('data')[0].id;
        }
        $.ajax({
          type: "POST",
          url: "/ppsingle/ajax/actions.php",
          data: {
            'p1_id'    : $('#choice_p1_game').select2('data')[0].id,
            'p2_id'    : $('#choice_p2_game').select2('data')[0].id,
            'p1_score' : s1,
            'p2_score' : s2,
            'winner_id': winnerid,
            'action'   : 'save_game'
          },
          success: function (data) {
            console.log('the server returned ' + data);
          },
          dataType: "json"
        });
      }

      function reset() {
        bx = canvas.width / 2;
        by = canvas.height / 2;
        xv = -xv;
        yv = Math.floor(Math.random() * 76 + 100) / FPS;
        p1y = p2y = canvas.height / 2 - 50;
        context.fillStyle = "white";
        context.fillRect(0, p1y, pt, ph);
        context.fillRect(canvas.width - pt, p2y, pt, ph);
      }

      function reset_game() {
        bx = canvas.width / 2;
        by = canvas.height / 2;
        xv = -xv;
        yv = Math.floor(Math.random() * 76 + 100) / FPS;
        score1 = score2 = 0;
        p1y = p2y = canvas.height / 2 - 50;
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
            if (score2 === parseInt(document.querySelector(".choice_game").value)) {
              context.fillStyle = "white";
              context.font = '50px serif';
              context.fillText(score1, 300, 50);
              context.fillText(score2, canvas.width - 325, 50);
              alert(`${$('#choice_p2_game').select2('data')[0].text} has won the game!`);
              sendResult(score1, score2);
              clearInterval(gameLoopInterval);
              document.querySelector(".home_box").style.display = "block";
              document.querySelector("#game").style.display = "none";
              reset_game();
            }
            reset();
          }
        }
        if (bx + bs > canvas.width) {
          if (by + bs > p2y && by + bs < p2y + ph) {
            xv = -xv;
            dy = by - (p2y + ph / 2);
          } else {
            score1++;
            if (score1 === parseInt(document.querySelector(".choice_game").value)) {
              context.fillStyle = "white";
              context.font = '50px serif';
              context.fillText(score1, 300, 50);
              context.fillText(score2, canvas.width - 325, 50);
              alert(`${$('#choice_p1_game').select2('data')[0].text} has won the game!`);
              sendResult(score1, score2);
              clearInterval(gameLoopInterval);
              document.querySelector(".home_box").style.display = "block";
              document.querySelector("#game").style.display = "none";
              reset_game();
            }
            reset();
          }
        }

        // draw background, ball and pedals
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.setLineDash([40, 11]);
        context.beginPath();
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.strokeStyle = "white";
        context.stroke();
        context.fillStyle = "white";
        context.fillRect(0, p1y, pt, ph);
        context.fillRect(canvas.width - pt, p2y, pt, ph);
        context.beginPath();
        context.arc(bx, by, bs, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.fillStyle = "white";
        context.font = '50px serif';
        context.fillText(score1, 300, 50);
        context.fillText(score2, canvas.width - 325, 50);
        context.font = '20px serif';
        context.fillText($('#choice_p1_game').select2('data')[0].text, 80, 40);
        context.fillText($('#choice_p2_game').select2('data')[0].text, canvas.width - 200, 40);
      }
      //document.onkeydown = move;
      document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
      });
      document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
      });
    }
  });

  // document.querySelector("#navbar").addEventListener("click", function (e)  {
  //   var messageJSON = {
  //     chat_user: sessionStorage.getItem("user"),
  //     chat_message: ' has disconnected!',
  //     conn : 'shut'
  //   };
  //   conn.send(JSON.stringify(messageJSON));
  //   document.getElementById("login").style.display = "block";
  //   document.getElementById("rooms").style.display = "none";
  //   document.getElementById("formChat").style.display = "none";
  //   document.querySelector(".home_box").style.display = "block";
  // });

  document.querySelector("#create_room").addEventListener("click", function (e) {
    $.ajax({
      type: "POST",
      url: "/ppsingle/ajax/actions.php",
      data: {
        'action': 'create_room',
        'user'   : sessionStorage.getItem('user')
      },
      dataType: "json",
      success: function (data) {
        console.log(data);
        connect(data);
      }
    });
  });

  document.querySelector("#join_room").addEventListener("click", function (e) {
    document.getElementById("login").style.display = "none";
    document.getElementById("rooms").style.display = "block";
    document.querySelector(".home_box").style.display = "none";
  });

  $('.join_game').click(function() {
    if(confirm('Da li sigurno želite pridružiti igri?'))
    {
      $.ajax({
        type: "POST",
        url: "/ppsingle/ajax/actions.php",
        data: {
          'port'         : $(this).val(),
          'action'       : 'join_game'
        },
        dataType: "json",
        success: function(data) {
          console.log(data);
          connect(data);
        }
      });
      document.getElementById("login").style.display = "none";
      document.getElementById("formChat").style.display = "block";
      document.querySelector(".home_box").style.display = "none";
      document.getElementById("rooms").style.display = "none";
    }
  })
})