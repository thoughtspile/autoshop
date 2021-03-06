const keystone = require('keystone');
const User = keystone.list('User');
const auth = require('../auth');
const _ = require('lodash');
const greet = require('../greetEmail.js');

const EDITABLE = ['name', 'email', 'phone', 'password', 'about'];

exports = module.exports = (req, res) => {
  if (req.user && !req.user.isAnonymous) {
    return res.redirect(req.cookies.target || '/');
  }

  const view = new keystone.View(req, res);
  const locals = res.locals;

  locals.section = 'signin';
  locals.form = req.body;

  view.on('post', { action: 'signup' }, (next) => {
    const user = req.user;

    if (!user) {
      return res.status(404).send();
    }
    greet(req.body.email, req.body.name, req.body.password);

    _.assign(user, _.pick(req.body, EDITABLE), { removeAnonAt: null }).save((err, user) => {
      if (!err) {
        req.flash('success', 'Вы зарегистрировались в магазине!')
        return res.redirect('/');
      }
      req.flash('error', err || 'Произошла ошибка! Попробуйте войти или зарегистрироваться еще раз.');
      return view.render('signup');
    });
  });

  view.render('signup');
};
