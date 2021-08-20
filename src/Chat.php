<?php

namespace MyApp;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

include '../error.php';

class Chat implements MessageComponentInterface
{
  protected $port;
  protected $clients;
  protected $clientsMap;

  public function __construct($port)
  {
    $this->clients = new \SplObjectStorage;
    $this->port = $port;
  }

  public function onOpen(ConnectionInterface $conn){

    // Store the new connection to send messages to later
    if (count($this->clients) !== 2) {
      $this->clients->attach($conn);
      $clientNum = count($this->clients);
      echo "New connection! ({$conn->resourceId}) Connection number ({$clientNum})\n";
    }
  }

  public function onMessage(ConnectionInterface $from, $msg){
    $ms = json_decode($msg);
    // if (isset($ms->conn) && ($ms->conn == 'shut' || $ms->conn == 'on_close')) {
    //   $ms->clients = count($this->clients)-1;
    // } else {
    //   $ms->clients = count($this->clients);
    // }
    if (isset($ms->conn) && $ms->conn == 'open') {
      $this->clientsMap[$from->resourceId] = $ms->chat_user;
      
      echo ("map".$this->clientsMap[$from->resourceId]);
      
    }

    if (isset($ms->chat_user) && isset($ms->chat_message)) {
      $numRecv = count($this->clients) - 1;
      echo sprintf(
        'Connection %d sending message "%s" to %d other connection%s' . "\n",
        $from->resourceId,
        $msg,
        $numRecv,
        $numRecv == 1 ? '' : 's'
      );
      foreach ($this->clients as $client) {
        $client->send(json_encode($ms));
      }
    }
  }

  public function onClose(ConnectionInterface $conn)
  {
    $db = new \Mysqli;
    $db->connect('localhost','root','root','ping_pong');
    // The connection is closed, remove it, as we can no longesr send it mesages
    $this->clients->detach($conn);
    $clientNum = count($this->clients);

    $msg['chat_user'] = $this->clientsMap[$conn->resourceId];
    $msg['chat_message'] = "has disconnected!";
    $msg['conn'] = "on_shut";

    foreach ($this->clients as $client) {
      $client->send(json_encode($msg));
    }

    echo "Connection {$conn->resourceId} has disconnected\n";

    if ($clientNum == 0) {
      echo sprintf('Server is closed!');
      mysqli_query($db, "DELETE FROM available_ports WHERE port =".$this->port) or die(mysqli_error($db));
      exit - 1;
    }

    $conn->close();
  }

  public function onError(ConnectionInterface $conn, \Exception $e)
  {
    echo "An error has occurred: {$e->getMessage()}\n";
    $conn->close();
  }
}
