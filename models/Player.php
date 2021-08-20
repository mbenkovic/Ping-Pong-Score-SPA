<?php
  include '../error.php';

  class Player {
    function findAll() {
      $db = new Mysqli;
      $db->connect('localhost','root','root','ping_pong');
       
      $result = mysqli_query($db, "SELECT * FROM players WHERE is_deleted=0") or die(mysqli_error($db));

      $json_players = array();
      foreach ($result as $row) {
        $json_players[] = $row;
      }
      return $json_players;
    }

    function gamesPlayed() {
      $db = new Mysqli;
      $db->connect('localhost','root','root','ping_pong');
       
      $result = mysqli_query($db, 'SELECT games_played.id, CONCAT(pl1.ime," ", pl1.prezime) AS "player_1", CONCAT(pl2.ime," ", pl2.prezime) AS "player_2", p1_score, p2_score, date_played, (CASE WHEN winner_id=p1_id THEN "Player 1" ELSE "Player 2" END) AS "Winner"
                                   FROM games_played 
                                   INNER JOIN players pl1 ON p1_id=pl1.id
                                   INNER JOIN players pl2 ON p2_id=pl2.id
                                   ORDER BY date_played DESC') or die(mysqli_error($db));

      $json_players = array();
      foreach ($result as $row) {
        $json_players[] = $row;
      }
      return $json_players;
    }

    function leaderboard(){
      $db = new Mysqli;
      $db->connect('localhost','root','root','ping_pong');
      $result = mysqli_query($db, 'SELECT ime, prezime, COUNT(*) AS "total"
                                   FROM games_played
                                   INNER JOIN players p
                                   WHERE winner_id=p.id
                                   GROUP BY winner_id
                                   ORDER BY total DESC') or die(mysqli_error($db));

      $json_players = array();
      foreach ($result as $row) {
        $json_players[] = $row;
      }
      return $json_players;
    }

    function saveGame($data){
      $db = new Mysqli;
      $db->connect('localhost','root','root','ping_pong');
  
      mysqli_query($db, "INSERT INTO games_played (p1_id, p2_id, p1_score, p2_score, date_played, winner_id)
                         VALUES (".$data['p1_id'].",".$data['p2_id'].",".$data['p1_score'].",".$data['p2_score'].", 
                         STR_TO_DATE('".$data['date_played']."', '%Y-%m-%d %H:%i:%s'), ".$data['winner_id'].")") or die(mysqli_error($db));
    }

    function addPlayer($data){
      $db = new Mysqli;
      $db->connect('localhost','root','root','ping_pong');

      mysqli_query($db, "INSERT INTO players (ime, prezime, datum_rodenja, is_deleted)
                         VALUES ('".$data['ime']."','".$data['prezime']."','".$data['datum_rodenja']."', 0)") or die(mysqli_error($db));
    }

    function deletePlayer($id){
      $db = new Mysqli;
      $db->connect('localhost','root','root','ping_pong');

      mysqli_query($db, "UPDATE players SET is_deleted=1 WHERE id=".$id) or die(mysqli_error($db));
    }

    function editPlayer($data) {
      $db = new Mysqli;
      $db->connect('localhost', 'root', 'root', 'ping_pong');
      
      mysqli_query($db, "UPDATE players SET ime='".$data['ime']."', prezime='".$data['prezime'].
                        "', datum_rodenja='".$data['datum_rodenja']."' WHERE id=".$data['id']) or die(mysqli_error($db));
    }

    function deleteGame($id){
      $db = new Mysqli;
      $db->connect('localhost', 'root', 'root', 'ping_pong');
      
      mysqli_query($db, "DELETE FROM games_played WHERE id=".$id) or die(mysqli_error($db));
    }

    function register($data){
      $db = new Mysqli;
      $db->connect('localhost', 'root', 'root', 'ping_pong');

      $msg = array();
      $error = false;
      $fname = $db -> real_escape_string($data['ime']);
      $lname = $db -> real_escape_string($data['prezime']);
      $email = $db -> real_escape_string($data['email']);
      $psw = md5($db -> real_escape_string($data['password']));
      
      $result =  mysqli_query($db, "SELECT * FROM users WHERE email='".$email."'");
      $row_count = mysqli_num_rows($result);

      if ($row_count) {
        $error = true;
        $msg["type"] = 'failed';
        $msg["msg"] = 'Email already exists!';
      }

      if (!$error) {
        $token = sha1(uniqid());
        mysqli_query($db, "INSERT INTO users (ime, prezime, email, password, token)
        VALUES ('".$fname."', '".$lname."', '".$email."', '".$psw."', '".$token."')") or die(mysqli_error($db));
        $msg["type"] = 'success';
        $msg["msg"] = 'User registered successfully!';
      }
      echo json_encode($msg);
    }

    function login($data){
      $db = new Mysqli;
      $db->connect('localhost', 'root', 'root', 'ping_pong');

      $msg = array();
      $email = $data['email'];
      $psw = md5($data['password']);

      $result =  mysqli_query($db, "SELECT * FROM users WHERE email='".$email."' AND password='".$psw."'");
      $row_count = mysqli_num_rows($result);
      $user = array();
      foreach ($result as $row) {
        $user = $row;
      }
      
      if ($row_count) {
        $_SESSION['login_user'] = $email;
        $_SESSION['ime'] = $user['ime'];
        $_SESSION['prezime'] = $user['prezime'];
        $_SESSION['token'] = $user['token'];
        $_SESSION['user_name'] = $user['ime'].' '.$user['prezime'];
        
        $msg["type"] = 'success';
        $msg["msg"] = 'Logged in as: '.$user['ime'].' '.$user['prezime'];
        $msg["user"] = $email;
        $msg["token"] = $user['token'];
        $msg["user_name"] = $_SESSION['user_name'];
        
      } else {
          $msg["type"] = 'failed';
          $msg["msg"] = 'Incorrect email or password!';
      }
      echo json_encode($msg);
    }

    function checkPort($port){
      $db = new Mysqli;
      $db->connect('localhost', 'root', 'root', 'ping_pong');

      $result =  mysqli_query($db, "SELECT * FROM available_ports WHERE port=".$port);
      $row_count = mysqli_num_rows($result);
      if ($row_count) {
        return true;
      } else {
        return false;
      }
    }

    function addPort($user, $port) {
      $db = new Mysqli;
      $db->connect('localhost', 'root', 'root', 'ping_pong');

      mysqli_query($db, "INSERT INTO available_ports (user, port) VALUES ('".$user."', ".$port.")") or die(mysqli_error($db));
    }

    function getPorts(){
      $db = new Mysqli;
      $db->connect('localhost','root','root','ping_pong');
       
      $result = mysqli_query($db, 'SELECT * FROM available_ports') or die(mysqli_error($db));

      $ports = array();
      foreach ($result as $row) {
        $ports[] = $row;
      }
      return $ports;
    }

    function deletePort($port) {
      $db = new Mysqli;
      $db->connect('localhost','root','root','ping_pong');
       
      mysqli_query($db, "DELETE FROM available_ports WHERE port =".$port) or die(mysqli_error($db));
    }
  }
