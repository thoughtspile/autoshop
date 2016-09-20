var keystone = require('keystone');
var _ = require('lodash');

var Shop = keystone.list('Shop');
var Good = keystone.list('Good');
var Cart = keystone.list('Cart');
var GoodsByShops = keystone.list('GoodsByShops');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'home';

    var user = req.user;

    view.on('post', { action: 'add-to-cart' }, function(next) {
        if (!user) {
            next();
        }
        var orderData = {
            good: req.params['id'],
            uid: user._id,
            qty: 1
        };
		Cart.model.create(orderData)
            .then(
                () => next(),
                err => console.log(err)
            );
	});

    var present = [];

    Good.model.findById(req.params['id']).exec()
        .then(good => {
            locals.good = good;
            return GoodsByShops.model.find({ good: good._id }).exec();
        })
        .then(rels => {
            present = rels || [];
            const shop_ids = (rels || []).map(rel => rel.shop);
            return Shop.model.find({ _id: { $in: shop_ids } }).exec();
        })
        .then(shops => {
            locals.present = present.map(rel => {
                var shopData = _.find(shops || [], shop => ''+ rel.shop === '' + shop._id);
                return _.assignIn(rel, { shopData });
            });
        })
        .then(
            () => view.render('good'),
            err => console.log('err', err)
        );
};
