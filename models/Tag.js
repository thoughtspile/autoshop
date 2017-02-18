const keystone = require('keystone');
const Types = keystone.Field.Types;

const Tag = new keystone.List('Tag');

Tag.add({
    name: { type: Types.Text, required: true, initial: true },
    type: {
      type: Types.Select,
      options: ['string', 'number', 'bool' ],
      required: true,
      default: 'string',
    },
    strValue: { type: Types.Text, required: false, initial: false },
    numValue: { type: Types.Number },
    boolValue: { type: Types.Number },
});

Tag.register();
