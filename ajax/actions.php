<?php
  include '../models/Player.php';
  $player = new Player();

  $action = $_POST['action'];

  if ($action == 'get_players') {
    echo json_encode($player->findAll());
  }

  if ($action == 'save_game') {
    $data = $_POST;
    $data['date_played'] = date("Y-m-d H:i:s");
    $player->saveGame($data);
    echo json_encode(["success" => true]);
  }

  if ($action == 'add_player') {
    $data = $_POST;
    $player->addPlayer($data);
    echo json_encode(["success" => true]);
  }

  if ($action == 'delete_player') {
    $id = $_POST['id'];
    $player->deletePlayer($id);
    echo json_encode(["success" => true]);
  }

  if ($action == 'edit_player') {
    $data = $_POST;
    $player->editPlayer($data);
  }
  
  if ($action == 'delete_game') {
    $id = $_POST['id'];
    $player->deleteGame($id);
    echo json_encode(["success" => true]);
  }
?>