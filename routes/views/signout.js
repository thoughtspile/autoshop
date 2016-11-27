var keystone = require('keystone');
var _ = require('lodash');

exports = module.exports = (req, res) => {
    // FIXME: handle redirect to authorized area
    keystone.session.signout(req, res, () => res.redirect(req.headers.referer || '/'));
};
