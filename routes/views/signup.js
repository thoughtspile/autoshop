const keystone = require('keystone');
const User = keystone.list('User');
const auth = require('../auth');

exports = module.exports = (req, res) => {
	if (req.user) {
		return res.redirect(req.cookies.target || '/');
	}

	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'signin';
	locals.form = req.body;

	view.on('post', {
		action: 'signup'
	}, (next) => {
		if (!req.body.email || !req.body.password) {
			console.log('flash error');
			req.flash('error', 'Заполните обязательные поля');
			return next();
		}

		User.model.register({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      })
			.then(() => {
        auth.signin(req, res, () => {
          req.flash('success', 'Вы зарегистрировались в магазине!')
          res.redirect('/');
        });
      })
			.then(
				() => {},
				(err) => {
					req.flash('error', err || 'Произошла ошибка! Попробуйте войти или зарегистрироваться еще раз.');
					return next();
				}
			);
		// FIXME hangs on save error
	});

	view.render('signup');
};
