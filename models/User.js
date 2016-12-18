var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	phone: { type: String, initial: false, required: false },
	password: { type: Types.Password, label: 'Пароль', initial: true, required: true },
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
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Администратор', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
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


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
