<?php
  include '../models/Player.php';
  include '../error.php';
  $player = new Player();

  // $page = (isset($_GET['page']) ? $_GET['page'] : 1);
  // $perPage = (isset($_GET['per-page']) && ($_GET['per-page']) <= 50 ? $_GET['per-page'] : 5);
  // $start = ($page > 1) ? ($page * $perPage) - $perPage : 0;

  $result = $player->gamesPlayed();

  // $db = new Mysqli;
  // $db->connect('localhost','root','root','ping_pong');
  
  // $total = $db->query("select * from games_played")->num_rows;
  // $pages = ceil($total / $perPage);
  
  echo '<table class="center" id="table-id"><tr class="head"><td>Player 1</td><td>Player 2</td><td>P1 score</td><td>P2 score</td><td>Datum Igranja</td><td>Pobjednik</td><td>Akcije</td></tr>';
      foreach ($result as $row) {
        echo '<tr class="data-row"><td ';
        if ($row["p1_score"]>$row["p2_score"]) {
          echo 'class="winner"';
        }
        echo '>'.$row['player_1'] . '</td><td ';
        if ($row["p2_score"]>$row["p1_score"]) {
          echo 'class="winner"';
        }
        echo '>'.$row['player_2'] . '</td><td>' . $row['p1_score'] . '</td><td>'.$row['p2_score'] . '</td><td>' . 
                 $row['date_played'] . '</td><td>' . $row['Winner'] . '</td><td>
                 <button title="Izbriši Meč" class="crud_btn delete_game" value="'.$row['id'].'"><i class="fas fa-trash-alt"></i></button></td></tr>';
      }
      echo '</div></table>';
      // echo '<center><ul class="pagination"><li class = "back"><a href="#">&laquo;</a></li>';
			// for($i = 1 ; $i <= $pages; $i++):
			//   if ($i == $page) {
      //     echo '<li class = active_pag><a href="?page='.$i.'&per-page='.$perPage.'">'.$i.'</a></li>';
      //   } else {
      //     echo '<li><a href="?page='.$i.'&per-page='.$perPage.'">'.$i.'</a></li>';
      //   }
      // endfor;
			// echo '<li class = "forward"><a href="#">&raquo;</a></li></ul></center>';
  ?>
    <script src = "/ppsingle/js/games_played.js"></script>