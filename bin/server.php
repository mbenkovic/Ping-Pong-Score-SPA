<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use MyApp\Chat;

include '../error.php';

if (isset($argv[1])) {
    $port = $argv[1];
}

require dirname(__DIR__) . '/vendor/autoload.php';
$server = IoServer::factory(
  new HttpServer(
    new WsServer(
      new Chat($port)
    )
  ),
  $port
);
  
$server->run();