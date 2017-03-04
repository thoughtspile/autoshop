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

const assembleCartItems = (items = [], user) => {
  const Good = keystone.list('Good');
  return Good.model.find({ _id: { $in: items.map(item => item.good) } }).exec()
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
}

Cart.schema.static('byUser', (user) => {
  if (!user) {
    return Promise.resolve([]);
  }

  return Cart.model.find({ uid: user._id, order: null }).exec()
    .then(items => assembleCartItems(items, user));
});

Cart.schema.static('setQty', (user, good_id, qty) => {
  // TODO check if good exists
  // TODO validate qty
  return Cart.model.findOneAndUpdate(
    { uid: user._id, good: good_id, order: null },
    { $set: { qty } },
    { upsert: true }
  ).exec();
});

// if sourceUser has a non-empty cart: replace targetUser's cart with sourceUser's
Cart.schema.static('merge', (srcUser, targetUser) => {
  if (!srcUser || !targetUser || srcUser._id === targetUser._id) {
    return Promise.resolve();
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

Cart.schema.static('getOrder', (orderId) => {
  return keystone.list('Order').model.findById(orderId).exec()
    .then(order => { console.log(order); return JSON.parse(_.get(order, 'frozenOrder', '[]')) });
})

Cart.schema.static('removeFromCart', (user, good_id) => {
  return Cart.model.find({ uid: user._id, good: good_id, order: null }).remove().exec();
});

Cart.schema.static('inCart', (uid, goodId) => {
  return Cart.model.find({ uid, good: goodId, order: null }).exec();
})

Cart.schema.static('checkout', (user) => {
  const Order = keystone.list('Order');
  let order = null;

  return Cart.model.byUser(user)
    .then(cart => Order.model.create({ frozenOrder: JSON.stringify(cart) }))
    .then(_order => {
      order = _order;
      return Cart.model.update(
        { uid: user._id, order: null },
        { $set: { order: order._id } },
        { multi: true }
      ).exec();
    })
    .then(() => order);
});

Cart.schema.static('getQty', (user, goods = []) => {
  const uid = user ? user._id : null;
  const goodIds = goods.map(g => g._id);
  console.log(uid);
  return Cart.model.find({ uid, good: { $in: goodIds }, order: null }).exec()
    .then((items = []) => {
      const res = {};
      goodIds.forEach(gid => {
        const inCart = _.find(items, i => '' + i.good == '' + gid);
        res[gid] = inCart ? inCart.qty : 0;
      });
      return res;
    });
});

Cart.schema.index({ user: 1, good: 1 });

Cart.register();
