var keystone = require('keystone');
var _ = require('lodash');

var Shop = keystone.list('Shop');
var Good = keystone.list('Good');
var Cart = keystone.list('Cart');
var GoodsByShops = keystone.list('GoodsByShops');

const SPECIAL_FIELDS = ["_id", "img", "prices", "brand", "good_id", "name", "category", "desc_short", "desc"];

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  locals.section = 'home';

    const user = req.user;
    const uid = user ? user._id : null;
    const goodId = req.params['id'];
    // TODO: qty

    view.on('post', { action: 'add-to-cart' }, function(next) {
      if (!user) {
        next();
      }
      const orderData = { good: goodId, uid, qty: req.body.qty };
      Cart.model.create(orderData).then(
        () => res.redirect(`/goods/${goodId}`),
        err => console.log(err)
      );
    });

    var present = [];

    Good.model.findById(goodId).exec()
        .then((good) => {
          good.meta = Object.keys(good._doc)
            .filter(key => SPECIAL_FIELDS.indexOf(key) === -1)
            .map(key => ({ key, value: good._doc[key] }));
          locals.good = good;
        })
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
        .then(() => Good.model.catSummary(locals.good.category, req.user))
        .then(parentCategory => { locals.parentCategory = parentCategory; })
        // есть ли товар в корзине
        .then(() => Cart.model.find({ uid, good: goodId }).exec())
        .then((cartItems) => { locals.count = cartItems.reduce((s, q) => s + q.qty, 0); })
        .then(
            () => view.render('good'),
            err => console.log('err', err)
        );
};
