const _ = require('lodash');

const serialize = user => _.defaults(
  _.omit(user.toObject({ virtuals: true }), 'list', '_'),
  { email: '', password: null }
);

module.exports.me = (req, res) => {
	const user = req.user;

	if (!user) {
		return res.status(404).json({ error: true });
	}

  res.json({ user: serialize(user) });
};

const EDITABLE = ['name', 'email', 'phone', 'password'];
module.exports.edit = (req, res) => {
	const user = req.user;

  if (!user) {
		return res.status(404).json({ error: true });
	}

  _.assign(user, _.pick(req.body, EDITABLE)).save((err, user) => err
    ? res.status(500).json({ error: true })
    : res.json({ user: serialize(user) })
  );
};
