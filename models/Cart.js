var keystone = require('keystone');
var Types = keystone.Field.Types;

var Cart = new keystone.List('Cart');

Cart.add({
    uid: { type: Types.Relationship, ref: 'User' },
    good: { type: Types.Relationship, ref: 'Good' },
    qty: { type: Types.Number, initial: false, required: true }
});

Cart.register();
