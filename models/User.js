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
    category: { type: Types.Number, label: 'Категория', initial: true, required: true, default: 3 },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Администратор', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
