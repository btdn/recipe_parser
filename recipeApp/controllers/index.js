var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'home' });
});

/* GET demo page. */
router.get('/demo', function(req, res, next) {
  res.render('demo', { title: 'demo' });
});

module.exports = router;
