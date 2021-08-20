<?php
  include '../models/Player.php';
  include '../error.php';
  $player = new Player();
  $result = $player->leaderboard();

      echo '<table class = "center"><tr class = "head"><td>Ime</td><td>Prezime</td><td>Pobjede</td></tr>';
      foreach ($result as $row) {
      echo '<tr class = "data-row"><td>' . $row['ime'] . '</td><td>' . $row['prezime'] . '</td><td>' . $row['total'] . '</td></tr>'; 
      }
      echo "</table>";
  
?>