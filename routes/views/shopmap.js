var keystone = require('keystone');

var Shop = keystone.list('Shop');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.section = 'map';

  Shop.model.find({}).exec()
    .then(shops => { locals.shops = shops; })
    .then(
      () => view.render('shopmap'),
      err => console.log('err', err)
    );
};
