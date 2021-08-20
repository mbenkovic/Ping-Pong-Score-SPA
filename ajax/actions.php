<?php
  session_start();
  $_SESSION['id'] = $_SESSION['token'];

  include '../models/Player.php';
  include '../error.php';

  $player = new Player();

  $action = $_POST['action'];

  function generatePort(){
    $player = new Player();
    $newPort = rand(5000,5999);
    while ($player->checkPort($newPort)) {
      $newPort = rand(5000,5999);
    }
    return $newPort;
  }

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

  if ($action == 'register_user') {
    $data = $_POST;
    $player->register($data); 
  }

  if ($action == 'login_user') {
    $data = $_POST;
    $player->login($data); 
  } 

  if ($action == 'logout_user') {
    session_unset();
    session_destroy();
    $msg = array();
    $msg["type"] = 'logout';
    $msg["msg"] = 'User has logged out!';
    
    echo json_encode($msg);
  }

  if ($action == 'check_status') {
    $msg = array();
    if (isset($_SESSION['login_user'])) {
      $msg["type"] = 'ACTIVE';
      $msg["msg"] = 'Logged in as: '.$_SESSION['ime'].' '.$_SESSION['prezime'];
      $msg["user"] = $_SESSION['login_user'];
      $msg["token"] =  $_SESSION['token'];
      $msg["user_name"] = $_SESSION['ime'].' '.$_SESSION['prezime'];
    } else {
      $msg["type"] = 'EMPTY';
    }
    echo json_encode($msg);
  }

  if ($action == 'create_room') {
    $data = $_POST;
    $currPort = generatePort();
    $player->addPort($data['user'], $currPort);
    
    exec('php -q ../bin/server.php '.$currPort. ' > /dev/null 2>&1 &');
    echo json_encode($currPort);
  }

  if ($action == 'join_game') {
    $data = $_POST;
    echo json_encode($data['port']);
  }

  if ($action == 'delete_port') {
    $data = $_POST;
    $player->deletePort($data['port']);
    echo json_encode(["success" => true]);
  }
?>