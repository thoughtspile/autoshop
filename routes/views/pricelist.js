var keystone = require('keystone');

var Good = keystone.list('Good');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'pricelist';

    var filter = {};
    if (req.query['category']) {
      filter.category = req.query['category'];
    }
    if (req.query['search']) {
      filter.name = new RegExp(req.query['search'], 'i');
    }
    locals.activeCategory = req.query['category'] || 'Любая категория';

    Good.model.find(filter).exec()
        .then(goods => {
            goods.forEach(good => {
              good.price = good.priceForUser(req.user);
            });
            locals.goods = goods.filter(good => !!good.price);
        })
        .then(() => Good.model.distinct('category', {}).exec())
        .then(categories => {
            locals.categories = categories;
        })
        .then(
            () => view.render('pricelist'),
            err => console.log('err', err)
        );
};
