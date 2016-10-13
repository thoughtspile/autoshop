var keystone = require('keystone');

var Good = keystone.list('Good');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'pricelist';

    Good.model.find({}).exec()
        .then(goods => {
            locals.goods = goods;
        })
        .then(
            () => view.render('pricelist'),
            err => console.log('err', err)
        );
};
