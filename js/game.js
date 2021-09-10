let paddle = {w: 10, h:100}
let leftPaddle = (rightPaddle = ball = {});
let score1 = (score2 = 0);
let player1, player2;
let increment = 0.2;
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;
let pause = false;
var interval;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const canvasH = canvas.height;
const canvasW = canvas.width;

ball = { x: 200, y: 200, r: 10, dx: 2, dy: 1 };
leftPaddle = { x: 0, y: 250 };
rightPaddle = { x: canvasW - 10, y: 250 };

// document.querySelector("#single_game").addEventListener("click", function (e) {
//   let id1 = $("#choice_p1_game").select2("data")[0].id;
//   let id2 = $("#choice_p2_game").select2("data")[0].id;
//   if (id1 === id2) {
//     alert("Choose different players!");
//   }
// });

function showMessage(messageHTML) {
  $("#chat-box").append(messageHTML);
}

const game = {
  conn: null,
  started: false,
  init: (port) => {
    game.conn = new WebSocket(`ws://localhost:${port}/`);
    game.conn.onopen = function (e) {
      document.getElementById("login").style.display = "none";
      document.getElementById("formChat").style.display = "block";
      document.querySelector(".home_box").style.display = "none";
      var messageJSON = [3, sessionStorage.getItem("user"), "has connected!", parseInt(document.querySelector(".choice_game").value)];
      game.conn.send(JSON.stringify(messageJSON));
    };
    game.conn.onmessage = function (e) {
      let Data = JSON.parse(e.data);
      //console.log(Data);
      if (!game.started && Data[0] === 1) {
        document.querySelector(".home_box").style.display = "none";
        document.querySelector("#game").style.display = "block";
        document.getElementById("formChat").style.display = "none";
        game.started = true;

        interval = setInterval(() => game.conn.send(JSON.stringify([1])), 30);
      }

      if (Data[0] === 1 && Data[1] === -100){
        player1 = Data[2];
        player2 = Data[3];
      } else if (Data[0] === 1 && Data[1] != -100) {
        ball.x = Data[1];
        ball.y = Data[2];
        leftPaddle.y = Data[3];
        rightPaddle.y = Data[4];
        game.draw();
      } else if (Data[0] === 3 && Data[3] === 2) {
        showMessage("<div class = 'chat-box-message'>" + Data[1] + " " + Data[2] + "</div><br>");
        document.querySelector("#play_multy").style.display = "block";
      } else if (Data[0] === 3 && Data[3] === 1) {
        showMessage("<div class = 'chat-box-message'>" + Data[1] + " " + Data[2] + "</div><br>");
        document.querySelector("#play_multy").style.display = "none";
      } else if (Data[0] === 4) {
        showMessage("<div class = 'chat-box-message'>" + Data[1] + ": " + Data[2] + "</div><br>");
      } else if (Data[0] === 5) {
        score1 = Data[1];
        score2 = Data[2];
      } else if (Data[0] === 0 && Data[1] === 1){
        clearInterval(interval);
        alert(`${player1} has won the game!`);
        document.getElementById("game").style.display = "none";
        document.getElementById("formChat").style.display = "block";
        
      } else if (Data[0] === 0 && Data[1] === 2){
        clearInterval(interval);
        alert(`${player2} has won the game!`);
        document.getElementById("game").style.display = "none";
        document.getElementById("formChat").style.display = "block";
      }

    };
    game.conn.onclose = function (e) {
      console.log("Disconnected!");
    };
  },
  sendMove: (msg) => {
    game.conn.send(JSON.stringify(msg));
  },
  draw: () => {
    ctx.clearRect(0, 0, canvasW, canvasH);

    drawBall();
    drawScore();
    drawCenterLine();
    drawLeftPaddle();
    drawRightPaddle();
  }
};

function drawRightPaddle() {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(rightPaddle.x, rightPaddle.y, paddle.w, paddle.h);
  ctx.fill();
  ctx.closePath();
}
function drawLeftPaddle() {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, paddle.w, paddle.h);
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.font = "20px serif";
  ctx.fillText(score1, 300, 50);
  ctx.fillText(score2, canvasW - 330, 50);
  ctx.fill();
  ctx.fillText(player1, 80, 40);
  ctx.fillText(player2, canvas.width - 200, 40);
  ctx.closePath();
}

function drawCenterLine() {
  ctx.beginPath();
  ctx.setLineDash([40, 11]);
  ctx.moveTo(canvasW / 2, 0);
  ctx.lineTo(canvasW / 2, canvasH);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.closePath();
}


$(document).ready(function () {


  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(e) {
    if (e.key == "ArrowUp") game.sendMove([2, 1, 1]);
    if (e.key == "ArrowDown") game.sendMove([2, 1, 2]);
  }

  function keyUpHandler(e) {
    if (e.key == "ArrowUp") game.sendMove([2, 2, 1]);
    if (e.key == "ArrowDown") game.sendMove([2, 2, 2]);
  }

  document.querySelector("#close_conn").addEventListener("click", function (e) {
    game.conn.close();
    document.getElementById("login").style.display = "block";
    document.getElementById("formChat").style.display = "none";
    document.querySelector(".home_box").style.display = "block";
  });

  document.querySelector("#play_multy").addEventListener("click", function (e) {
    var messageJSON = [1, -100];
    game.conn.send(JSON.stringify(messageJSON));
  });

  $("#frmChat").on("submit", function (e) {
    e.preventDefault();
    $("#chat-user").attr("type", "hidden");
    var messageJSON = [4, sessionStorage.getItem("user"), $("#chat-message").val()];
    game.conn.send(JSON.stringify(messageJSON));
  });

  $.ajax({
    type: "POST",
    url: "/ppsingle/ajax/actions.php",
    data: {
      action: "get_players",
    },
    success: function (jsonObject) {
      const newData = jsonObject.map((item) => {
        return {
          id: item.id,
          text: item.ime + " " + item.prezime,
        };
      });
      $(".choice_select_game").select2({
        data: newData,
        width: "50%",
        theme: "classic",
      });
    },
    dataType: "json",
  });

  document.querySelector("#create_room").addEventListener("click", function (e) {
      $.ajax({
        type: "POST",
        url: "/ppsingle/ajax/actions.php",
        data: {
          action: "create_room",
          user: sessionStorage.getItem("user"),
        },
        dataType: "json",
        success: function (data) {
          setTimeout(function () {
            game.init(data);
          }, 200);
        },
      });
    });

  document.querySelector("#join_room").addEventListener("click", function (e) {
    document.getElementById("login").style.display = "none";
    document.getElementById("rooms").style.display = "block";
    document.querySelector(".home_box").style.display = "none";
  });

  $(".join_game").click(function () {
    if (confirm("Da li sigurno želite pridružiti igri?")) {
      $.ajax({
        type: "POST",
        url: "/ppsingle/ajax/actions.php",
        data: {
          port: $(this).val(),
          action: "join_game",
        },
        dataType: "json",
        success: function (data) {
          console.log(data);
          game.init(data);
        },
      });
      document.getElementById("login").style.display = "none";
      document.getElementById("formChat").style.display = "block";
      document.querySelector(".home_box").style.display = "none";
      document.getElementById("rooms").style.display = "none";
    }
  });
});
