const keystone = require('keystone');
const Types = keystone.Field.Types;
const uuid = require('uuid/v4');

const Order = new keystone.List('Order');
Order.add({
  uuid: { type: Types.Text, required: true, default: uuid },
});
Order.register();
