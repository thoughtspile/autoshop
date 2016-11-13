var keystone = require('keystone');
var _ = require('lodash');

exports = module.exports = (req, res) => {
    if (req.user) {
		return res.redirect(req.cookies.target || '/');
	}

	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'signin';
	locals.form = req.body;

	view.on('post', { action: 'signin' }, (next) => {
		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your username and password.');
			return next();
		}

		keystone.session.signin(
            { email: req.body.email, password: req.body.password },
            req,
            res,
            () => res.redirect('/'),
            () => {
    			req.flash('error', 'Неверные данные, попробуйте еще раз или зарегистрируйтесть');
    			return next();
    		}
        );
	});

    view.render('signin');
};
