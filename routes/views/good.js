var keystone = require('keystone');
var _ = require('lodash');

var Shop = keystone.list('Shop');
var Good = keystone.list('Good');
var Cart = keystone.list('Cart');
var GoodsByShops = keystone.list('GoodsByShops');

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'home';

    const user = req.user;
    const uid = user._id;
    const goodId = req.params['id'];
    // TODO: qty

    view.on('post', { action: 'add-to-cart' }, function(next) {
        if (!user) {
            next();
        }
        const orderData = { good: goodId, uid, qty: 1 };
		Cart.model.create(orderData).then(
            () => res.redirect(`/goods/${goodId}`),
            err => console.log(err)
        );
	});

    var present = [];

    Good.model.findById(goodId).exec()
        .then((good) => { locals.good = good; })
        // Магазины, в которых есть товар
        .then(() => GoodsByShops.model.find({ good: goodId }).exec())
        .then((rels) => {
            present = (rels || []).filter(rel => rel.qty > 0);
            const shop_ids = present.map(rel => rel.shop);
            return Shop.model.find({ _id: { $in: shop_ids } }).exec();
        })
        .then((shops) => {
            const assembled = present.map(rel => {
                const shopData = _.find(shops || [], shop => ''+ rel.shop === '' + shop._id);
                return _.assignIn(rel, { shopData });
            });
            locals.present = _.sortBy(assembled, rel => rel.shopData.address);
        })
        // товары в категории
        .then(() => {
            return Good.model.aggregate([
                { $match: { category: locals.good.category } },
                {
                    $group : {
                        _id : '$category',
                        count: { $sum: 1 },
                        minPrice: { $min: '$prices.cat1' },
                        items: { $push: '$$ROOT' },
                    },
                }
            ]).exec();
        })
        .then(parentCategory => { locals.parentCategory = parentCategory[0]; })
        // есть ли товар в корзине
        .then(() => Cart.model.find({ uid, good: goodId }).exec())
        .then((cartItems) => { console.log(cartItems); locals.inCart = !_.isEmpty(cartItems); })
        .then(
            () => view.render('good'),
            err => console.log('err', err)
        );
};
