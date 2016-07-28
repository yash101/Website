<?php

$path = pathinfo($_SERVER["SCRIPT_FILENAME"]);
if($path["extension"] == "js") {

  chdir(__DIR__);

  header("Content-Type: application/javascript");
  require("." . $_SERVER["SCRIPT_NAME"]);

} else if($path["extension"] == "css") {

  chdir(__DIR__);

  header("Content-Type: text/css");
  require("." . $_SERVER["SCRIPT_NAME"]);

} else {
  return FALSE;
}

?>
