var keystone = require('keystone');
const _ = require('lodash');

var Good = keystone.list('Good');
var Tag = keystone.list('Tag');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'pricelist';

    const tagFilters = [].concat(req.query['filter'] || []).filter(id => !!id);

    var filter = {};
    if (req.query['category']) {
      filter.category = req.query['category'];
    }
    if (req.query['search']) {
      filter.name = new RegExp(req.query['search'], 'i');
    }
    if (!_.isEmpty(tagFilters)) {
      filter.tags = { $all: tagFilters };
    }
    locals.activeCategory = req.query['category'] || 'Любая категория';
    const cat = req.query['category'];
    console.log(filter);

    Good.model.find(filter).exec()
        .then(goods => {
            goods.forEach(good => {
              good.price = good.priceForUser(req.user);
            });
            locals.goods = goods.filter(good => !!good.price);
        })
        .then(() => Tag.model.byCats(cat ? [cat] : []))
        .then((availFilters) => {
          availFilters.forEach((tag) => {
            tag.values.forEach((op) => {
              op.selected = (tagFilters.indexOf(op.id) !== -1);
            });
          });
          locals.filters = availFilters;
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
