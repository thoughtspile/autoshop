var keystone = require('keystone');
var User = keystone.list('User');

module.exports = (done) => {
  return User.model.remove({ password: null }).exec().then(() => done());
};
