const keystone = require('keystone');
const Types = keystone.Field.Types;
const _ = require('lodash');

const Cart = new keystone.List('Cart');

Cart.add({
    uid: { type: Types.Relationship, ref: 'User' },
    good: { type: Types.Relationship, ref: 'Good' },
    qty: { type: Types.Number, initial: false, required: true }
});

Cart.schema.static('byUser', (user) => {
  const Good = keystone.list('Good');
  let items = [];

  return Cart.model.find({ uid: user._id }).exec()
    .then((_items) => { items = _items; })
    .then(() => {
      return Good.model.find({ _id: { $in: items.map(item => item.good) } }).exec();
    })
    .then((_goods) => {
      const goods = _goods.map(good => _.assign(
        good.toObject(),
        { price: good.priceForUser(user) }
      ));
      return items
        .map(item => _.assign(
          item.toObject(),
          { goodData: _.find(goods, good => '' + good._id === '' + item.good) }
        ))
        .filter(i => i.goodData);
    });
});

Cart.schema.static('setQty', (user, good_id, qty) => {
  // TODO check if good exists
  // TODO validate qty
  return Cart.model.findOneAndUpdate(
    { uid: user._id, good: good_id },
    { $set: { qty } },
    { upsert: true }
  ).exec();
});

Cart.schema.static('removeFromCart', (user, good_id, qty) => {
  return Cart.model.find({ uid: user._id, good: good_id }).remove().exec();
});

Cart.register();
