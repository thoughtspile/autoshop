var keystone = require('keystone');
var _ = require('lodash');

exports = module.exports = (req, res) => {
    keystone.session.signout(req, res, () => res.redirect('/'));
};
