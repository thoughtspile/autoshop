var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Good = new keystone.List('Good');

Good.add({
    prices: {
        cat1: { type: Types.Number, initial: false, required: true },
        cat2: { type: Types.Number, initial: false, required: true },
        cat3: { type: Types.Number, initial: false, required: true }
    },
    category: { type: String, initial: false, required: true },
    name: { type: Types.Text, default: '', required: true },
    desc: { type: Types.Text, default: '', required: true },
    good_id: { type: Types.Text }
});

// Provide access to Keystone
Good.schema.virtual('img').get(function () {
  console.log('middleare', this, this.__proto__);
	return ['/images/goods/' + this.good_id + '.jpg'];
});

Good.register();
