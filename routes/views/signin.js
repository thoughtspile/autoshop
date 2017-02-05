const keystone = require('keystone');
const auth = require('../auth');

exports = module.exports = (req, res) => {
  const done = () => res.redirect(req.headers.referer || '/');

	if (req.user && !req.user.isAnonymous) {
		return done();
	}

	return auth.signin(req, res, done, done);
};
