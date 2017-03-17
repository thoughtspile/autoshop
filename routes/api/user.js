const _ = require('lodash');
const greet = require('../greetEmail.js');

const serialize = user => _.assign(
  _.defaults(
    _.omit(user.toObject({ virtuals: true }), 'list', '_'),
    { email: '', password: null }
  ),
  { name: (user.name instanceof Object) ? user.name.full : user.name }
);

module.exports.me = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ error: true });
  }

  res.json({ user: serialize(user) });
};

const EDITABLE = ['name', 'email', 'phone', 'password', 'about'];
module.exports.edit = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ error: true });
  }
  greet(req.body.email, req.body.name, req.body.password);

  _.assign(user, _.pick(req.body, EDITABLE)).save((err, user) => err
    ? res.status(500).json({ error: true })
    : res.json({ user: serialize(user) })
  );
};
