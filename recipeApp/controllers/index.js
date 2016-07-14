exports.index = function (req, res) {
  res.render('index', { title: 'home' });
};

exports.demo = function (req, res) {
  res.render('demo', { title: 'demo' });
};

/* GET demo page. */
/*exports.demo('/demo', function(req, res, next) {
  res.render('demo', { title: 'demo' });
});*/
