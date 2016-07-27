<?php
require("config.php");

$SqlConnection = NULL;
try {
  $SqlConnection = new PDO("mysql:host=" . $dbServername . ";dbname=" . $dbName, $dbUsername, $dbPassword);
  $SqlConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e) {
  die("Connection Failed: " . $e->getMessage());
}

?>
<!DOCTYPE html>
<html>
  <head>
    <title><?php echo $siteTitle; ?></title>
    <link href="style/main.css" rel="stylesheet" type="text/css">
  </head>
  <body>
    <div id="menuButton">&nbsp;</div>
    <div id="menu">&nbsp;</div>
  </body>
</html>
