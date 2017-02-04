const keystone = require('keystone');
const auth = require('../auth');

exports = module.exports = (req, res) => {
	if (req.user && !req.user.isAnonymous) {
		return res.redirect(req.cookies.target || '/');
	}

	const view = new keystone.View(req, res);
	const locals = res.locals;
	locals.form = req.body;

	// Form processing
	auth.signin(req, res, () => {
		res.redirect(req.headers.referer || '/');
	});
};
