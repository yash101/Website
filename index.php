<?php
require_once(__DIR__ . "/config.php");
require_once(__DIR__ . "/dbconn.php");
?>
<!DOCTYPE html>
<html>
  <head>
    <title><?php echo $siteTitle; ?></title>

    <script src="js/jquery-3.1.0.min.js" type="text/javascript"></script>

    <link href="style/main.css" rel="stylesheet" type="text/css">
    <link href="style/header_image.css" rel="stylesheet" type="text/css">
    <link href="style/blog.css" rel="stylsheet" type="text/css">

    <script src="js/main.js" type="text/javascript"></script>
    <script src="js/nav_drawer.js" type="text/javascript"></script>
    <script src="js/blog.js" type="text/javascript"></script>
    <script src="js/jquery.mobile.custom.min.js" type="text/javascript"></script>
  </head>
  <body>
    <div id="content">
      <div id="intro_img"></div>
      <div id="thoughts">...Thoughts are loading...Dang, this is taking wayyy too long!</div>
    </div>
    <div id="menu">&nbsp;</div>
    <div id="menuButton">&nbsp;</div>
  </body>
</html>
