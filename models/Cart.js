const keystone = require('keystone');
const Types = keystone.Field.Types;
const _ = require('lodash');
const uuid = require('uuid/v4');

const Cart = new keystone.List('Cart');

Cart.add({
    uid: { type: Types.Relationship, ref: 'User' },
    good: { type: Types.Relationship, ref: 'Good' },
    qty: { type: Types.Number, initial: false, required: true },
    order: { type: Types.Relationship, ref: 'Order' },
});

Cart.schema.static('byUser', (user) => {
  if (!user) {
    return Promise.resolve([]);
  }

  const Good = keystone.list('Good');
  let items = [];

  return Cart.model.find({ uid: user._id, order: null }).exec()
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

// if sourceUser has a non-empty cart: replace targetUser's cart with sourceUser's
Cart.schema.static('merge', (srcUser, targetUser) => {
  if (!srcUser || !targetUser || srcUser._id === targetUser._id) {
    return new Promise();
  }

  return Cart.model.count({ uid: srcUser._id }).exec()
    .then((srcCount) => {
      if (!srcCount) {
        return;
      }

      return Cart.model.remove({ uid: targetUser._id }).exec().then(() => {
        return Cart.model.update(
          { uid: srcUser._id },
          { $set: { uid: targetUser._id } }
        ).exec();
      });
    });
});

Cart.schema.static('removeFromCart', (user, good_id) => {
  return Cart.model.find({ uid: user._id, good: good_id, order: null }).remove().exec();
});

Cart.schema.static('inCart', (uid, good) => {
  return Cart.model.find({ uid, good: goodId, order: null }).exec();
})

Cart.schema.static('checkout', (user) => {
  const Order = keystone.list('Order');
  console.log('checkout', user, Order);
  let order = null;
  return Order.model.create({})
    .then(_order => {
      order = _order;
      console.log('order created', order, 'issue update');
      return Cart.model.update(
        { uid: user._id, order: null },
        { $set: { order: order._id } },
        { multi: true }
      ).exec();
    })
    .then(() => order);
});

Cart.register();
