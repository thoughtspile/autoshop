const keystone = require('keystone');
const auth = require('../auth');

exports = module.exports = (req, res) => {
    if (req.user) {
		return res.redirect(req.cookies.target || '/');
	}

	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'signin';
	locals.form = req.body;

	view.on('post', { action: 'signin' }, (next) => auth.signin(req, res, next));

    view.render('signin');
};
