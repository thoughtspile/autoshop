var keystone = require('keystone');
var Types = keystone.Field.Types;

var Shop = new keystone.List('Shop');

Shop.add({
  name: { type: Types.Text, initial: false, required: true },
  phone: { type: Types.Text, initial: false, required: false },
  type: { type: Types.Text, initial: false, required: false },
  address: { type: Types.Text, initial: false, required: true },
  lat: { type: Types.Number, initial: false, required: true },
  lon: { type: Types.Number, initial: false, required: true },
  features: { type: Types.TextArray, default: [], required: false },
  website: { type: Types.Text, initial: false, required: false },
});

Shop.register();
