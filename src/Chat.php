<?php

namespace MyApp;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

include '../error.php';
include '../game.php';

class Chat implements MessageComponentInterface
{
  protected $port;
  protected $clients;
  protected $game = null;
  protected $lastscore = [0, 0];
  protected $clientsMap;

  public function __construct($port)
  {
    $this->clients = new \SplObjectStorage;
    $this->port = $port;
    $this->game = new \Game;
  }

  public function onOpen(ConnectionInterface $conn){
      $this->clients->attach($conn);
      if (count($this->clients) == 1) {
        $this->game->addPlayerLeft($conn->resourceId);

      } else {
        $this->game->addPlayerRight($conn->resourceId);
      }
  }

  public function onMessage(ConnectionInterface $from, $msg){
    $ms = json_decode($msg);

    switch ($ms[0]){
      case 0:
        //kraj igre
        break;
      case 1:
        //start igre
        if ($ms == [1, -100]) {
          
          foreach ($this->clients as $client) {
            $client->send(json_encode(array_merge([1, -100], $this->game->getPlayerNames())));
          }
        } else {
        $state = $this->game->getNextState();

        if ($state[0] == 0) {
          foreach ($this->clients as $client) {
            $client->send(json_encode($state));
          }
        } else {
          $score = array_slice($state, 4);
          $state = array_slice($state, 0, 4);
  
          $sendScore = $score != $this->lastscore;
          if ($sendScore) $this->lastscore = $score;
  
          foreach ($this->clients as $client) {
            $client->send(json_encode(array_merge([1], $state)));
  
            if ($sendScore) $client->send(json_encode(array_merge([5], $score)));
          }
        }  
      }   
        break;
      case 2:
        //potezi igrača
        $this->game->setPaddleKeydown($from->resourceId, $ms);
        break;
      case 3:
        $this->clientsMap[$from->resourceId] = $ms[1];
        if (count($this->clients) == 1){
          $this->game->setPlayToValue($ms[3]);
          $this->game->addPlayer1Name($this->clientsMap[$from->resourceId]);
        } else {
          $this->game->addPlayer2Name($this->clientsMap[$from->resourceId]);
        }
        $ms[3] = count($this->clients);
        foreach ($this->clients as $client) {
          $client->send(json_encode($ms));
        }
        break;
      case 4:
        //chat msg
        foreach ($this->clients as $client) {
          $client->send(json_encode($ms));
        }
        break;
    }

  }

  public function onClose(ConnectionInterface $conn)
  {
    $db = new \Mysqli;
    $db->connect('localhost','root','root','ping_pong');
    // The connection is closed, remove it, as we can no longesr send it mesages
    $this->clients->detach($conn);

    // $ms[3] = count($this->clients);
    // foreach ($this->clients as $client) {
    //   $client->send(json_encode($ms));
    // }

    if (count($this->clients) == 0) {
      mysqli_query($db, "DELETE FROM available_ports WHERE port =".$this->port) or die(mysqli_error($db));
      exit - 1;
    }

    $conn->close();
  }

  public function onError(ConnectionInterface $conn, \Exception $e)
  {
    // echo "An error has occurred: {$e->getMessage()}\n";
    $conn->close();
  }
}
