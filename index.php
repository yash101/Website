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
    <script src="js/type=jquery-3.1.0.min.js"text/javascript"></script>
    <link href="style/main.css" rel="stylesheet" type="text/css">
  </head>
  <body>
    <div id="content">&nbsp;</div>
    <div id="menuButton">&nbsp;</div>
    <div id="menu">&nbsp;</div>
  </body>
</html>
