var keystone = require('keystone');

const Cart = keystone.list('Cart');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  console.log('GET', req.params['order_id']);
  Cart.model.getOrder(req.params['order_id'])
    .then(cart => { console.log(cart); locals.cart = cart; })
    .then(
      () => view.render('invoice', { layout: null }),
      (err) => res.status(500).send()
    );
};
