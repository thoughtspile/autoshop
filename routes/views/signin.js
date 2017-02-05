const keystone = require('keystone');
const auth = require('../auth');

const Cart = keystone.list('Cart');

exports = module.exports = (req, res) => {
  const user = req.user;

  const done = () => res.redirect(req.headers.referer || '/');
  const mergeCarts = () => Cart.model.merge(user, req.user).then(done);

  // do nothing if already logged in
	if (user && !user.isAnonymous) {
		return done();
	}

	return auth.signin(req, res, mergeCarts, done);
};
