<?php
class Game
{
  protected $ball = [
    'x' => 300,
    'y' => 300,
    'r' => 10,
    'move' => [
      'x' => 2,
      'y' => 1
    ]
  ];
  protected $pads = [
    'left' => [
      'h' => 250,
      'player' => false,
      'keydown' => false,
    ],
    'right' => [
      'h' => 250,
      'player' => false,
      'keydown' => false,
    ],
    'speed' => 5
  ];
  protected $score = [0, 0];
  protected $playTo;
  protected $player1;
  protected $player2;
  

  function setPlayToValue($x){
    $this->playTo = $x;
  }

  function setInitialVariablesP1() {
    $this->ball['x'] = 400;
    $this->ball['y'] = 300;
    $this->ball['move']['x'] = 2;
    $this->ball['move']['y'] = 1;
    $this->pads['left']['h'] = 250;
    $this->pads['right']['h'] = 250;
  }

  function setInitialVariablesP2() {
    $this->ball['x'] = 400;
    $this->ball['y'] = 300;
    $this->ball['move']['x'] = -2;
    $this->ball['move']['y'] = -1;
    $this->pads['left']['h'] = 250;
    $this->pads['right']['h'] = 250;
  }

  function detectCollision() {
    // Detect Right Paddle Collision
    if (
      $this->ball['x'] > 780 &&
      $this->ball['y'] > $this->pads['right']['h'] &&
      $this->ball['y'] < $this->pads['right']['h'] + 100
    ) {
      $this->ball['move']['x'] = -$this->ball['move']['x'];
      $this->ball['move']['y'] += 0.2;
    }

    // Detect Left Paddle Collision
    if (
      $this->ball['x'] < 20 &&
      $this->ball['y'] > $this->pads['left']['h'] &&
      $this->ball['y'] < $this->pads['left']['h'] + 100
    ) {
      $this->ball['move']['x'] = -$this->ball['move']['x'] + 0.4;
      $this->ball['move']['y'] += 0.2;
    }

    // Detect Top or Bottom Collision
    if ($this->ball['y'] > 590 || $this->ball['y'] < 10) {
      $this->ball['move']['y'] = -$this->ball['move']['y'];
    }

    // Detect Left Collision
    if ($this->ball['x'] < 10) {
      $this->setInitialVariablesP1();
      $this->score[1]++;
    }

    // Detect Right Collision
    if ($this->ball['x'] > 790) {
      $this->setInitialVariablesP2();
      $this->score[0]++;
    }

    if ($this->pads['left']['h'] < 0) $this->pads['left']['h'] = 0;
    if ($this->pads['right']['h'] < 0) $this->pads['right']['h'] = 0;
    if ($this->pads['left']['h'] > 500) $this->pads['left']['h'] = 500;
    if ($this->pads['right']['h'] > 500) $this->pads['right']['h'] = 500;
  }

  function getNextState() {
    $this->ball['x'] += $this->ball['move']['x'];
    $this->ball['y'] += $this->ball['move']['y'];

    if ($this->pads['left']['keydown'] == 1) $this->pads['left']['h'] -= $this->pads['speed'];
    if ($this->pads['left']['keydown'] == 2) $this->pads['left']['h'] += $this->pads['speed'];
    if ($this->pads['right']['keydown'] == 1) $this->pads['right']['h'] -= $this->pads['speed'];
    if ($this->pads['right']['keydown'] == 2) $this->pads['right']['h'] += $this->pads['speed'];

    $this->detectCollision();
    if ($this->score[0] == $this->playTo) {
      return [0, 1, $this->ball['x'], $this->ball['y'], $this->pads['left']['h'], $this->pads['right']['h'], $this->score[0], $this->score[1]];  
    } else if ($this->score[1] == $this->playTo){
      return [0, 2, $this->ball['x'], $this->ball['y'], $this->pads['left']['h'], $this->pads['right']['h'], $this->score[0], $this->score[1]];  
    } else {
      return [$this->ball['x'], $this->ball['y'], $this->pads['left']['h'], $this->pads['right']['h'], $this->score[0], $this->score[1]];
    }
  }

  function addPlayerLeft($id) {
    $this->pads['left']['player'] = $id;
  }

  function addPlayerRight($id){
    $this->pads['right']['player'] = $id;
  }

  function addPlayer1Name($name){
    $this->player1 = $name;
  }
  
  function addPlayer2Name($name){
    $this->player2 = $name;
  }

  function getPlayerNames(){
    return [$this->player1, $this->player2];
  }

  function setPaddleKeydown($id, $msg) {
    //keyDown
    if ($this->pads['left']['player'] == $id && $msg[1] == 1) $this->pads['left']['keydown'] = $msg[2];
    if ($this->pads['right']['player'] == $id && $msg[1] == 1) $this->pads['right']['keydown'] = $msg[2];

    //keyUp
    if ($this->pads['left']['player'] == $id && $msg[1] == 2 ) $this->pads['left']['keydown'] = false;
    if ($this->pads['right']['player'] == $id && $msg[1] == 2 ) $this->pads['right']['keydown'] = false;
  }
}
