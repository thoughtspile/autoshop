var keystone = require('keystone');
var Tag = keystone.list('Tag');
var User = keystone.list('User');

module.exports = (done) => {
  return User.model.find({ 'name.first': '' }).exec()
    .then(users => {
      console.log(users);
      return Promise.all(users.map(u => {
        u.name = '';
        return u.save();
      }));
    })
    .then(() => done());
};
