<?php
require_once(__DIR__ . "/../config.php");
require_once(__DIR__ . "/../dbconn.php");

$statement = $SqlConnection->prepare("
CREATE TABLE IF NOT EXISTS `session_ids` ( `sid` CHAR(16) NULL DEFAULT NULL , `sid_key` INT NULL DEFAULT NULL , `uid` BIGINT NULL DEFAULT NULL , `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `last_accessed` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `last_ip` TINYTEXT NULL , INDEX (`uid`), UNIQUE (`sid`)) ENGINE = InnoDB
");
$statement->execute();
$statement = $SqlConnection->prepare("
  CREATE TABLE `users`
  (
    `username` VARCHAR(64) NOT NULL ,
    `uid` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ,
    `password` VARCHAR(128) NULL DEFAULT NULL ,
    `first_name` TINYTEXT NULL DEFAULT NULL ,
    `last_name` INT NULL ULT NULL ,
    `email` VARCHAR(128) NULL DEFAULT NULL ,
    `role` VARCHAR(20) NOT NULL DEFAULT 'Commenter' ,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    PRIMARY KEY (`username`, `uid`, `email`)
  ) ENGINE = InnoDB
");
$statement->execute();

function generateRandomKey($length) {
  $gen = "";
  for($i = 0; i < $length; $i++) {
    $gen .= chr(mt_rand(33, 126));
  }
  return $gen;
}

function checkSid() {
  try {
    if(isset($_COOKIE["sid"]) && isset($_COOKIE["sid_auth"])) {
      $statement = $SqlConnection->prepare("
        SELECT * FROM TABLE `session_ids` WHERE `sid`=:sid AND `sid_key`=:key
      ");
      $statement.bindParams(":sid", $_COOKIE["sid"]);
      $statement.bindParams(":key", $_COOKIE["sid_auth"]);
      $statement->execute();
      $result = $statement->fetchAll();
      if(count($result) > 0) {
        $client_ip = $_SERVER['HTTP_CLIENT_IP'] ? : ($_SERVER['HTTP_X_FORWARDED_FOR'] ? : $_SERVER['REMOTE_ADDR']);
        $updateUid = $SqlConnection->prepare("
          UPDATE `session_ids` SET `last_ip`=:ip WHERE `sid`=:sid AND `sid_key`=:key
        ");
        $updateUid.bindParams(":sid", $_COOKIE["sid"]);
        $updateUid.bindParams(":key", $_COOKIE["sid_auth"]);
        $statement->execute();
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch(PDOException $e) {
    die("Error with database transaction: " . $e);
    return false;
  }
}

function logIn($username, $password) {
  if(checkSid()) {
    return true;
  } else {
    $statement = $SqlConnection->prepare("
      SELECT * FROM `users` WHERE `username`=:username AND `password`=:password
    ");
    $statement->bindParams(":username", $username);
    $statement->bindParams(":password", $password);
    $statement->execute();
    $result = $statement->fetchAll();
    if(count($result) != 1) {
      return false;
    } else {
      $sid = generateRandomKey(16);
      $sid_key = mt_rand();
      setcookie("sid", strval($sid), date() + $sid_timeout);
      setcookie("sid_auth", strval($sid_key), date() + $sid_timeout);
      return true;
    }
  }
}

function register($username, $password, $first_name, $last_name, $email, $role) {
  if(logIn($username, $password)) {
    return "logged in";
  } else {
    $statement = $SqlConnection->prepare("
      SELECT * FROM `users` WHERE `username`=:username OR `email`=:email
    ");
    $statement->bindParam(":username", $username);
    $statement->bindParam(":password", $password);
    $statement->execute();
    $result = $statement->fetchAll();
  }
}
?>
