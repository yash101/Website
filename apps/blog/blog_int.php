<?php
require_once(__DIR__ . "/../../dbconn.php");
require_once(__DIR__ . "/../../config.php");
$result = NULL;
try {
  $SqlConnection->exec("CREATE TABLE IF NOT EXISTS `blogPosts` ( `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , `author` VARCHAR(128) NOT NULL DEFAULT 'No Author', `publish_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Post Publish Date' , `content` LONGTEXT NULL DEFAULT NULL , `title` TINYTEXT NOT NULL , `status` VARCHAR(20) NOT NULL DEFAULT 'Draft' , `name` TINYTEXT NOT NULL , `last_modified` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`), INDEX (`author`), INDEX (`status`), FULLTEXT (`title`))");
  $statement = $SqlConnection->prepare("SELECT COUNT(*) FROM `blogPosts`");
  $statement->execute();
  $result = $statement->fetchAll();

  $num = intval($result[0]["COUNT(*)"]);
  if($num == 0) $disable_blog = true;
  else $disable_blog = false;

  if($num > 0) {
    $posts = NULL;
    $rangeLow = 0;
    $rangeMax = $homepageBlogMaxDisplayedPosts;
    $rm = 0;

    if(isset($_REQUEST["l"])) {
      $want = intval($_REQUEST["l"]);
    } else {
      $want = 0;
    }

    if($want < 0 || $want > $num - 1 || $want >= $rangeMax - 1) $want = 0;

    $rm = intval($rangeMax);

    $pst = $SqlConnection->prepare("SELECT * FROM `blogPosts` WHERE status='Draft' ORDER BY publish_date LIMIT " . $want . ", " . $rm);

    $pst->execute();
    $result = $pst->fetchAll();
  }

} catch(PDOException $e) {
  die("SQL Error: " . $e);
}
?>
<?php
if(!$disable_blog) {
  foreach($result as $post) {
?>
<div class="post">
  <div class="header">
    <div class="title"><?php echo($post["title"]); ?></div>
    <div class="author"><?php echo($post["author"]); ?></div>
    <div class="publish_date"><?php echo($post["publish_date"]); ?></div>
  </div>
  <div class="contentPanel">
    <div class="content"><?php echo($post["content"]); ?></div>
  </div>
  <div class="footer">
    <div class="last_modified"><?php echo($post["last_modified"]); ?></div>
  </div>
</div>
<?php 
  }
}
?>
