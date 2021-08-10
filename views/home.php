<div class="home_box">
  <p>Welcome to my first SPA CRUD app. <br /><br />
    Here you can select players and play ping pong game or you can track your score if you are playing IRL.
  </p>
  <div class="p1_section_game">
    <p>Select player one: </p>
    <select name="choice_p1_game" id="choice_p1_game" class="choice_select_game"></select>
  </div>
  <div class="select_play_to_game">
    <b>
      <p class="play_to">Playing To </p>
    </b>
    <select name="choice" class="choice_game">
      <option value="5">5</option>
      <option value="7">7</option>
      <option value="9">9</option>
      <option value="11">11</option>
    </select>
  </div>
  <div class="p2_section_game">
    <p>Select player two: </p>
    <select name="choice_p2_game" id="choice_p2_game" class="choice_select_game"></select>
  </div>

  <button class="play_button">Play Game</button>
</div>

<canvas id="game" , width="800" , height="600"></canvas>

<div class="home_box_rules">
  <p>Player 1: use W to move up and S to move down <br />
     Player 2: use upArrow to move up and downArrow to move down <br />
  </p>
</div>

<script src="/ppsingle/js/game.js"></script>