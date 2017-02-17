var keystone = require('keystone');

const Cart = keystone.list('Cart');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  console.log('GET', req.params['order_id']);
  Cart.model.getOrder(req.params['order_id'])
    .then(cart => {
      cart.forEach((item, i) => {
        item.index = i;
        item.subtotal = item.goodData.price * item.qty;
      });
      locals.cart = cart;
      locals.total = cart.reduce((t, i) => t + i.subtotal, 0);
    })
    .then(
      () => view.render('invoice', { layout: null }),
      (err) => res.status(500).send()
    );
};
