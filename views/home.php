<?php
  include '../models/Player.php';
  include '../error.php';
  $player = new Player();
?>

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

  <button class="play_button" id ="single_game">Play Game</button>
  <button class="play_button" id="create_room">Create Room</button>
  <button class="play_button" id="join_room">Join Room</button>
  <p id = "home_rules">Player 1: use W to move up and S to move down <br />
     Player 2: use upArrow to move up and downArrow to move down <br />
  </p>
</div>

<canvas id="game" , width="800" , height="600"></canvas>

<div class="home_box_rules">
  <p>Player 1: use W to move up and S to move down <br />
     Player 2: use upArrow to move up and downArrow to move down <br />
  </p>
</div>

<div id="formChat">
  <form name="frmChat" id="frmChat">
    <div id="chat-box"></div>
    <input type="text" name="chat-message" id="chat-message" placeholder="Message"  class="chat-input chat-message" required />
    <input type="submit" id="btnSend" name="send-chat-message" value="Send">
  </form>
  <button id="close_conn">Close</button>
  <button id="play_multy">Play</button>
</div>

<div id="rooms">
<?php
$ports = $player->getPorts();
echo '<table class="center" id="port_table"><tr class="head"><td>User</td><td>Port</td><td>Akcije</td></tr>';
      foreach ($ports as $row) {
        echo '<tr class="data-row"><td>'.$row['user'] . '</td><td>' . $row['port'] .'</td><td>
                 <button title="Join Game" class="crud_btn join_game" value="'.$row['port'].'"><i class="fas fa-plus-square"></i></button></td></tr>';
      }
      echo '</div></table>';
?>
</div>
<script src="/ppsingle/js/game.js"></script>