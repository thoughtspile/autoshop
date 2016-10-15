var keystone = require('keystone');

var test = require('../test');

var Shop = keystone.list('Shop');
var Good = keystone.list('Good');
var GoodsByShops = keystone.list('GoodsByShops');

test();

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

    Shop.model.find({}).exec()
        .then(shops => {
            locals.shops = shops;
        })
        .then(() => Good.model.aggregate([ {
                $group : {
                    _id : '$category',
                    count: { $sum: 1 },
                    itemName: { $first: '$name' },
                    itemImg: { $first: '$img' },
                    minPrice: { $min: '$prices.cat1' }
                }
            } ]).exec()
        )
        .then(goodsByCategory => {
            locals.goodsByCategory = goodsByCategory;
        })
        .then(
            () => view.render('index'),
            err => console.log('err', err)
        );
};
