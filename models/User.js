var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', {
  nocreate: true,
  noedit: false,
  nodelete: true,
  label: 'Пользователи',
  singular: 'пользователь',
  plural: 'пользователи',
});

User.add({
	name: { type: Types.Name, initial: false, required: false, index: true },
	email: { type: Types.Email, initial: false, required: false, index: true },
	isVerified: { type: Boolean, default: false, required: true },
	phone: { type: String, initial: false, required: false },
	sid: { type: String, initial: false, required: false, index: true },
	password: { type: Types.Password, label: 'Пароль', initial: true, required: false },
  category: {
    type: Types.Select,
    label: 'Категория',
    initial: true,
    required: true,
    default: 1,
    numeric: true,
    options: [
      { value: 1, label: 'розница' },
      { value: 2, label: 'мелкий опт' },
      { value: 3, label: 'средний опт' },
      { value: 4, label: 'крупный опт' },
    ],
  },
  about: {
    type: Types.Select,
    label: 'О себе',
    initial: true,
    required: true,
    default: 'private',
    options: [
      { value: 'private', label: 'Частное лицо' },
      { value: 'company', label: 'Компания' },
    ],
  }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Администратор', index: true },
});
User.defaultColumns = 'name, category, email, phone, about';

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.schema.virtual('isAnonymous').get(function () {
	return !this.email || !this.password;
});

User.schema.virtual('categoryKey').get(function () {
	switch (this.category) {
    case 1: return 'prices.retail';
    case 2: return 'prices.wholesale.sm';
    case 3: return 'prices.wholesale.md';
    case 4: return 'prices.wholesale.lg';
  };
  return 'prices.retail';
});

User.schema.virtual('categoryName').get(function () {
	switch (this.category) {
    case 1: return 'розница';
    case 2: return 'мелкий опт';
    case 3: return 'средний опт';
    case 4: return 'крупный опт';
  };
  return 'prices.retail';
});

// Expects { email, password, ?name, ?phone  }
User.schema.static('register', (payload) => {
  return User.model.findOne({ email: payload.email }).exec()
    .then((user) => {
      if (user) {
        throw new Error('Пользователь с таким адресом уже зарегистрирован');
      }
    })
    .then(() => User.model.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
    }));
  // FIXME hangs on save error
});

User.schema.static('registerAnon', (sid) => {
  return User.model.findOne({ sid }).exec()
    .then((user) => user && user.sid ? user : User.model.create({ sid }));
});

User.register();
