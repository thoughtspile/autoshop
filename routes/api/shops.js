const keystone = require('keystone');

const Shop = keystone.list('Shop');

module.exports.list = (req, res) => {
  Shop.model.find({}).exec().then(
    shops => res.json({ shops }),
    err => res.status(500).json({ error: true })
  );
};
