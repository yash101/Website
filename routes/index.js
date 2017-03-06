var express = require('express');
var router = express.Router();

var fs = require('fs');
var constants = JSON.parse(fs.readFileSync('./constants.json', 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { constants: constants });
});

module.exports = router;
