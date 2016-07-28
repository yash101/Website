<?php
require_once(__DIR__ . "/config.php");
$SqlConnection = NULL;
try {
  $SqlConnection = new PDO("mysql:host=" . $dbServername . ";dbname=" . $dbName, $dbUsername, $dbPassword);
  $SqlConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e) {
  die("Connection Failed: " . $e->getMessage());
}
?>
