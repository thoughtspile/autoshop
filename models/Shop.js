var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Shop = new keystone.List('Shop');

Shop.add({
	address: { type: Types.Text, initial: false, required: true },
	coords: { type: Types.Text, initial: false, required: true },
	desc: { type: Types.Markdown, initial: true, required: true, default: '' },
	phone: { type: Types.Text, initial: true, required: true, default: '+79652650061' },
    // good_ids: { type: [ String ], default: [], required: true }
});

Shop.register();
