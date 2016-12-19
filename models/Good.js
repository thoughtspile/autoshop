var keystone = require('keystone');
var Types = keystone.Field.Types;
const _ = require('lodash');

/**
 * User Model
 * ==========
 */
var Good = new keystone.List('Good');

Good.add({
    prices: {
      retail: { type: Types.Number, initial: false, required: true, label: 'Розничная цена' },
      wholesale: {
        lg: { type: Types.Number, initial: false, required: true, label: 'Розничная цена' },
        md: { type: Types.Number, initial: false, required: true, label: 'Средний опт' },
        sm: { type: Types.Number, initial: false, required: true, label: 'Мелкий опт' },
      }
    },
    category: { type: String, initial: false, required: true },

    category: { type: String, initial: false, required: true },
    category: { type: String, initial: false, required: true },
    category: { type: String, initial: false, required: true },
    category: { type: String, initial: false, required: true },

    name: { type: Types.Text, default: '', required: true },
    desc: { type: Types.Text, default: '', required: true },
    good_id: { type: Types.Text }
});

// Provide access to Keystone
Good.schema.virtual('img').get(function () {
	return ['/images/goods/' + this.good_id + '.jpg'];
});

Good.schema.method('priceForUser', function (user) {
  if (!user || !user.categoryKey) {
    return this.prices.retail || null;
  }
	return _.get(this, user.categoryKey, null);
});

Good.schema.static('catSummary', (category, user, limit) => {
  let summary = null;
  return (Good.model.aggregate([
    { $match: { category } },
    { $group : {
      _id : '$category',
      count: { $sum: 1 },
      minPrice: { $min: '$prices.retail' }
    } }
  ]).exec())
    .then(parentCategory => { summary = parentCategory[0]; })
    .then(() => Good.model.find({ category }).exec())
    .then(goods => {
      goods.forEach(good => {
        good.price = good.priceForUser(user);
      });
      return goods.filter(g => !!g.price);
    })
    .then((goods) => { summary.items = goods; })
    .then(() => summary);
});

Good.schema.static('byCategory', (user) => {
  let goodsByCategory = null;
  return (Good.model.aggregate([ {
    $group : {
      _id : '$category',
      count: { $sum: 1 },
      minPrice: { $min: '$prices.retail' },
    }
  } ]).exec())
    .then(goodsByCategory_ => {
      goodsByCategory_.forEach(cat => { cat.items = []; });
      goodsByCategory = goodsByCategory_;
    })
    .then(() => Good.model.find({}).exec())
    .then(goods => {
      goods.forEach(good => {
        good.price = good.priceForUser(user);
        if (!good.price) {
          return;
        }
        const cat = _.find(goodsByCategory, cat => '' + cat._id === '' + good.category);
        cat.items.push(good);
      });
    })
    .then(() => goodsByCategory);
});

Good.register();
