const keystone = require('keystone');
const User = keystone.list('User').model;
const auth = require('../auth');

exports = module.exports = (req, res) => {
    if (req.user) {
		return res.redirect(req.cookies.target || '/');
	}

	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'signin';
	locals.form = req.body;

    view.on('post', { action: 'signup' }, (next) => {
		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Заполните обязательные поля');
			return next();
		}

        User.findOne({ email: req.body.email }).exec()
            .then((user) => {
                if (user) {
                    throw new Error('Пользователь с таким адресом уже зарегистрирован');
                }
            })
            .then(() => User.create({
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				password: req.body.password,
			})
            .then(() => auth.signin(req, res, next))
            .then(
                () => {},
                (err) => {
                    req.flash('error', err || 'There was a problem signing you in, please try again.');
                    return next();
                }
            );
            // FIXME hangs on save error
	});

	view.render('signup');
};
