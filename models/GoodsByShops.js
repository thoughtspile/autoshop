var keystone = require('keystone');
var Types = keystone.Field.Types;

var GoodsByShops = new keystone.List('GoodsByShops');

GoodsByShops.add({
    shop: { type: Types.Relationship, ref: 'Shop' },
    good: { type: Types.Relationship, ref: 'Good' },
    qty: { type: Types.Number, required: false }
});

GoodsByShops.register();
