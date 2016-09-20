var keystone = require('keystone');

var Shop = keystone.list('Shop');
var Good = keystone.list('Good');
var GoodsByShops = keystone.list('GoodsByShops');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'home';

    Shop.model.findById(req.params['id']).exec()
        .then(shop => {
            locals.shop = shop;
            return GoodsByShops.model.find({ shop: shop._id }).distinct('good').exec();
        })
        .then(good_ids => Good.model.find({ _id: { $in: good_ids } }).exec())
        .then(goods => { locals.goods = goods; })
        .then(
            () => view.render('shop'),
            err => console.log('err', err)
        );
};
