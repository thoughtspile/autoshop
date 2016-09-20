var keystone = require('keystone');
var _ = require('lodash');

var Cart = keystone.list('Cart');
var Good = keystone.list('Good');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'home';

    var user = req.user;
    var items = [];

    Cart.model.find({ uid: user._id }).exec()
        .then(_items => {
            items = _items;
            var good_ids = _items.map(item => item.good);
            return Good.model.find({ _id: { $in: good_ids } }).exec();
        })
        .then(goods => {
            items.forEach(item => {
                item.goodData = _.find(goods, good => '' + good._id === '' + item.good);
            });
            locals.items = items;
        })
        .then(
            () => view.render('cart'),
            err => console.log('err', err)
        );
};
