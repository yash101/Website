<?php
require_once(__DIR__ . "/../dbconn.php");
require_once(__DIR__ . "/../config.php");
?>

var app = app || {};
(function blog_js() {
  app.blog = app.blog || {};
  app.blog.initialized = app.blog.initialized || false;
  app.blog.init = function blogInit() {
    if(app.blog.initialized) return;
    $.get("../apps/blog/blog.php", function(data) {
      $("body > div#content > div#thoughts").html(data);
      app.blog.getPosts(0);
    });
  };

  app.blog.getPosts = app.blog.getPosts || function getPosts(start) {
    $.get("../apps/blog/blog_int.php?l=" + start, function(data) {
      $("body > div#content > div#thoughts > div#blog_content").html(data);
      if(data.trim().length == 0) {
        $("body > div#content > div#thoughts").css({
          "display": "none"
        });
      }
    });
  };

  app.blog.init();
})();

