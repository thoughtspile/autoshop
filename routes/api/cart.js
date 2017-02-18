const keystone = require('keystone');

const Cart = keystone.list('Cart');

module.exports.list = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(403).json({ error: true });
  }

  Cart.model.byUser(user).then(
    goods => res.json({ goods }),
    err => res.status(500).json({ error: true })
  );
};

module.exports.set = (req, res) => {
  const view = new keystone.View(req, res);
  const user = req.user;
  if (!user) {
    return res.status(403).json({ error: true });
  }

  Cart.model.setQty(user, req.body.good_id, req.body.qty)
    .then(() => Cart.model.byUser(user))
    .then(
      goods => res.json({ goods }),
      err => res.status(500).json({ error: true })
    );
};

module.exports.remove = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(403).json({ error: true });
  }

  Cart.model.removeFromCart(user, req.body.good_id)
    .then(() => Cart.model.byUser(user))
    .then(
      goods => res.json({ goods }),
      err => res.status(500).json({ error: true })
    );
};

module.exports.stats = (req, res) => {
  const stats = {
    count: 0,
    total: 0,
  };

  const user = req.user;
  if (!user) {
    return res.json(stats);
  }

  Cart.model.byUser(user)
    .then((goods) => {
      console.log(goods);
      stats.count = goods.reduce((c, i) => c + i.qty, 0);
      stats.total = goods.reduce((c, i) => c + i.goodData.price * i.qty, 0);
    })
    .then(
      () => res.json(stats),
      err => res.status(500).json({ error: true })
    );
};
