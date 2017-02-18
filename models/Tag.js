const keystone = require('keystone');
const mongoose = keystone.mongoose;
const _ = require('lodash');
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

Tag.schema.static('byCats', (cats = []) => {
  const Good = keystone.list('Good');
  const query = {};
  return Good.model.find({ category: { $in: cats } }).exec()
    .then((goods = []) => {
      const tagsUsed = _.uniq(_.flatten(goods.map(g => g.tags || [])));
      if (!_.isEmpty(tagsUsed) || !_.isEmpty(cats)) {
        query._id = { $in: tagsUsed };
      }
    })
    .then(() => Tag.model.find(query).exec())
    .then((tags) => {
      const byName = _.groupBy(tags, tag => tag.name);
      return Object.keys(byName)
        .filter(name => byName[name].length > 1)
        .map(name => ({ name, values: byName[name].map(t => t.strValue) }));
    });
});

Tag.register();