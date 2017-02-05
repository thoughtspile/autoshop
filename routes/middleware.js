/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var keystone = require('keystone');
var User = keystone.list('User');
var Cart = keystone.list('Cart');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		// no explicit home link, go there via logo click
		// { label: 'Home', key: 'home', href: '/' },
		{ label: 'Все товары', key: 'pricelist', href: '/pricelist' },
    { label: 'Контакты', key: 'contact', href: '/contact' },
	];

	res.locals.user = req.user.toObject({ virtuals: true });
	res.locals.loggedIn = req.user && !req.user.isAnonymous;
  Cart.model.byUser(req.user)
    .then(cart => { res.locals.cart = cart || []; })
    .then(next, next);
};

exports.anonUser = (req, res, next) => {
  if (req.user) {
    return next();
  }

  const sid = req.signedCookies['keystone.sid'];
  const ok = () => {
    console.log('ANON user created', req.user);
    return next();
  };
  const onErr = (err) => {
    console.log('ERROR creating anon user');
    return next();
  };

  User.model.registerAnon(sid)
    .then(user => keystone.session.signin(user._id, req, res, ok, onErr));
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
