const keystone = require('keystone');

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res);
  res.locals.section = 'map';
  view.render('shopmap');
};
