const keystone = require('keystone');
const Types = keystone.Field.Types;
const _ = require('lodash');

var Good = new keystone.List('Good', {
  label: 'Товары',
  singular: 'товар',
  plural: 'товары',
});

Good.add({
    prices: {
      retail: { type: Types.Number, initial: false, required: false, label: 'Розничная цена' },
      wholesale: {
        lg: { type: Types.Number, initial: false, required: false, label: 'Крупный опт' },
        md: { type: Types.Number, initial: false, required: false, label: 'Средний опт' },
        sm: { type: Types.Number, initial: false, required: false, label: 'Мелкий опт' },
      }
    },
    category: { type: String, initial: false, required: true },

    name: { type: Types.Text, default: '', required: true },
    desc: { type: Types.Text, default: '', required: false },
    good_id: { type: Types.Text },

    tags: { type: Types.Relationship, ref: 'Tag', many: true },
});
Good.defaultColumns = 'name, category, prices, desc, good_id';


// Provide access to Keystone
Good.schema.virtual('img').get(function () {
	return ['/images/goods/' + this.good_id + '.jpg'];
});

Good.schema.virtual('thumb').get(function () {
	return ['/images/goods/' + this.good_id + '.thumb.jpg'];
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
      goodsByCategory = _.sortBy(goodsByCategory_, c => -c.count);
    })
    .then(() => Good.model.find({}).exec())
    .then(goods => Good.model.personalize(user, goods))
    .then(goods => {
      const findCat = good => (
        _.find(goodsByCategory, cat => '' + cat._id === '' + good.category)
      );
      goods
        .filter(good => !!good.price && !!findCat(good))
        .forEach(good => findCat(good).items.push(good));
    })
    .then(() => goodsByCategory);
});

Good.schema.static('personalize', (user, goods = []) => {
  const uid = user ? user._id : null;
  const Cart = keystone.list('Cart');
  return Cart.model.getQty(user, goods)
    .then(qtyMap => (
      goods.map(good => _.assign(
        good.toObject(),
        { cartCount: qtyMap[good._id], price: good.priceForUser(user), img: good.img, thumb: good.thumb }
      ))
    ));
});

Good.schema.index(
  { name: "text", desc: "text" },
  { default_language: "russian" }
);

Good.register();
