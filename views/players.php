<?php
  include '../models/Player.php';
  include '../error.php';
  $player = new Player();
  $result = $player->findAll();
  echo '
  <div id="add_modal" class="add_modal">
    <div class="modal-content">
      <button class="add_close">&times;</button>
      <form id="add_form" method="POST">
        <h1 class = "h1_form">Dodaj novog igrača</h1>
        <label for="fname">Ime:</label><br>
        <input type="text" id="fname" name="fname" class="input" required><br>
        <label for="lname">Prezime:</label><br>
        <input type="text" id="lname" name="lname" class="input" required><br>
        <label for="birthdate">Datum rođenja:</label><br>
        <input type="date" id="birthdate" name="birthdate" class="input" required><br><br>
        <input type="submit" class="submit" value="Dodaj">
      </form>
    </div>
  </div>';
  echo '
  <div id="edit_modal" class="edit_modal">
    <div class="modal-content">
      <button class="edit_close">&times;</button>
      <form id="edit_form" method="POST">
        <h1 class="h1_form">Uređivanje igrača</h1>
        <label for="fname">Ime:</label><br>
        <input type="text" id="efname" name="fname" class="input" required><br>
        <label for="lname">Prezime:</label><br>
        <input type="text" id="elname" name="lname" class="input" required><br>
        <label for="birthdate">Datum rođenja:</label><br>
        <input type="date" id="ebirthdate" name="birthdate" class="input" required><br><br>
        <input type="submit" class="submit" value="Spremi promjene">
        <input type="hidden" id="user_id">
      </form>
    </div>
  </div>';
      echo '<div class="box"><div class="div_table"><button id="add" title="Dodaj Igrača"><i class="fas fa-plus"></i> Dodaj novog igrača</button>';
      echo '<table class="table"><tr class="head"><td>Ime</td><td>Prezime</td><td>Datum Rođenja</td><td>Akcije</td></tr>';
      foreach ($result as $row) {
      echo '<tr class="data-row"><td class="ime">' . 
            $row['ime'] . '</td><td class="prezime">' . 
            $row['prezime'] . '</td><td class="datum_rod">' . 
            $row['datum_rodenja'] . '</td><td>
            <button title="Uredi Igrača" class="crud_btn edit" value="'.$row['id'].'"><i class="far fa-edit"></i></button>
            <button title="Izbriši Igrača" class="crud_btn delete" value="'.$row['id'].'"><i class="fas fa-trash-alt"></i></button></td></tr>'; 
      }
      echo '</table></div></div>';
  ?>
    <script src = "/ppsingle/js/players.js"></script>