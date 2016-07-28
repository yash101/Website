<?php 
require_once(__DIR__ . "/config.php");
require_once(__DIR__ . "/dbconn.php");

if(isset($debug_enabled) && $debug_enabled == true) {
  if(!isset($_GET["num"]) || !isset($_GET["author"]) || !isset($_GET["status"])) {
    echo("ERROR: ?num,author,status is not set. Don't know how many posts to write!");
  } else {
    $author = $_GET["author"];
    $content = "";
    $status = $_GET["status"];
    $name = "";
    $statement = $SqlConnection->prepare("
    INSERT INTO `blogPosts` (`author`, `content`, `status`, `title`, `name`) VALUES
    (:author, :content, :status, :name, :name)
    ");

    $statement->bindParam(":author", $author);
    $statement->bindParam(":content", $content);
    $statement->bindParam(":status", $status);
    $statement->bindParam(":title", $name);
    $statement->bindParam(":name", $name);

    for($i = 0; $i < intval($_GET["num"]); $i++) {
      $content = file_get_contents("http://loripsum.net/api/8");
      $name = file_get_contents("http://loripsum.net/api/1/short/plaintext");
      if(strlen($name) > 255) $name = substr($name, 0, 64);
      $statement->execute();
    }
  }
} else {
  echo("ERROR: Debug mode is disabled. Please set \$debug_enabled to true in /config.php");
}
?>
