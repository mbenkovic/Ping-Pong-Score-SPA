$(document).ready(function () {
  const choice = document.querySelector(".choice");
  const playerOne = document.querySelector(".button1");
  const playerTwo = document.querySelector(".button2");
  const playerOneMinus = document.querySelector(".button3");
  const playerTwoMinus = document.querySelector(".button4");
  const resetButton = document.querySelector(".button5");
  const firstScore = document.querySelector("#first_score");
  const secondScore = document.querySelector("#second_score")

  let curr = parseInt(document.querySelector("#first_score").innerText);
  let curr2 = parseInt(document.querySelector("#second_score").innerText);
  let playTo = parseInt(choice.value);

  choice.addEventListener("change", reset);
  $(document.body).on("change", ".choice_select", reset);

  function reset() {
    firstScore.innerText = "0 ";
    secondScore.innerText = "0";
    firstScore.style.color = "#000000";
    secondScore.style.color = "#000000";
    curr = parseInt(document.querySelector("#first_score").innerText);
    curr2 = parseInt(document.querySelector("#second_score").innerText);
    document.querySelector(".who").innerText = "";
    playTo = parseInt(choice.value);
  }

  $.ajax({
    type: "POST",
    url : "/ppsingle/ajax/actions.php",
    data: {
      'action': 'get_players'
    },
    success: function (jsonObject) {
      const newData = jsonObject.map(item => {
        return {
          "id"  : item.id,
          "text": item.ime + " " + item.prezime
        }
      })
      $(".choice_select").select2({
        data : newData,
        width: "50%",
        theme: "classic"
      });
    },
    dataType: "json"
  });

  playerOne.addEventListener("click", function (e) {
    let id1 = $('#choice_p1').select2('data')[0].id;
    let id2 = $('#choice_p2').select2('data')[0].id;
    if (id1 === id2) alert('Choose different players!');
    if (curr >= 0 && curr < playTo && curr2 != playTo && id1 !== id2) {
      curr++;
      document.querySelector("#first_score").innerText = `${curr} `;
      if (curr === playTo) {
        firstScore.style.color = "green";
        secondScore.style.color = "red";
        let winner = $('#choice_p1').select2('data')[0];
        sendResult(winner);
        document.querySelector(".who").innerText = "  Player One Won!!";
      }
    }
  })

  playerTwo.addEventListener("click", function (e) {
    let id1 = $('#choice_p1').select2('data')[0].id;
    let id2 = $('#choice_p2').select2('data')[0].id;
    if (id1 === id2) alert('Choose different players!');
    if (curr2 >= 0 && curr2 < playTo && curr != playTo && id1 !== id2) {
      curr2++;
      document.querySelector("#second_score").innerText = `${curr2} `;
      if (curr2 === playTo) {
        firstScore.style.color = "red";
        secondScore.style.color = "green";
        let winner = $('#choice_p2').select2('data')[0];
        sendResult(winner);
        document.querySelector(".who").innerText = "  Player Two Won!!";
      }
    }
  })

  playerOneMinus.addEventListener("click", function (e) {
    let id1 = $('#choice_p1').select2('data')[0].id;
    let id2 = $('#choice_p2').select2('data')[0].id;
    if (id1 === id2) alert('Choose different players!');
    if (curr > 0 && curr < playTo && curr2 != playTo && id1 !== id2) {
      curr--;
      document.querySelector("#first_score").innerText = `${curr} `;
    }
  })

  playerTwoMinus.addEventListener("click", function (e) {
    let id1 = $('#choice_p1').select2('data')[0].id;
    let id2 = $('#choice_p2').select2('data')[0].id;
    if (id1 === id2) alert('Choose different players!');
    if (curr2 > 0 && curr2 < playTo && curr != playTo && id1 !== id2) {
      curr2--;
      document.querySelector("#second_score").innerText = `${curr2} `;
    }
  })

  function sendResult(winner) {
    let winnerid = $('#choice_p1').select2('data')[0].id;
    if (firstScore.innerText.trim() < secondScore.innerText) {
      winnerid = $('#choice_p2').select2('data')[0].id;
    }

    $.ajax({
      type: "POST",
      url: "/ppsingle/ajax/actions.php",
      data: {
        'p1_id'    : $('#choice_p1').select2('data')[0].id,
        'p2_id'    : $('#choice_p2').select2('data')[0].id,
        'p1_score' : firstScore.innerText.trim(),
        'p2_score' : secondScore.innerText,
        'winner_id': winnerid,
        'action'   : 'save_game'
      },
      success: function (data) {
        console.log('the server returned ' + data);
      },
      dataType: "json"
    });

  }

  resetButton.addEventListener("click", reset);
})