var keystone = require('keystone');
var Tag = keystone.list('Tag');
var Good = keystone.list('Good');

const path = require("path");
const glob = require("glob");
const fs = require("fs");
const _ = require('lodash');

const dir = './pricelists-csv/json/';
const IGNORE = [
  '',
  'Номер',
  'Описание',
  'Подробное описание',
  'Название',
  'Подробное описание/Принцип действия',
  'Номер / Артикул',
  'Модель / Название',
  'PIAA OIL FILTER',
  'Модель',
];
const NAME_KEYS = ['Модель', 'Модель / Название', 'Название', 'PIAA OIL FILTER'];
const KEYS = ['Номер', 'Номер / Артикул', 'PIAA OIL FILTER'];

module.exports = (done) => {
  glob(path.join(dir, '**', '*.json'), (err, filenames) => {
    const pairings = [];
    filenames.forEach(path => {
      JSON.parse(fs.readFileSync(path)).forEach(rec => {
        const recordKeyField = _.find(KEYS, k => rec[k]);
        const recordKey = rec[recordKeyField];
        const tags = Object.keys(rec)
          .filter(key => !IGNORE.includes(key))
          .map(name => ({ name, strValue: rec[name] }));
        const nameKeyField = _.find(NAME_KEYS, k => rec[k]);
        const name = rec[nameKeyField];
        if (!name) console.log('missing name', rec);
        pairings.push({ good: { id: recordKey, name, data: rec }, tags });
      });
    });

    Promise.all(
      pairings.map((pair) => {
        const tags = pair.tags;
        const goodQuery = pair.good
        return Good.model.findOne({ good_id: goodQuery.id }).exec().then(good => {
          if (!good) {
            console.log('missing good', goodQuery.id);
            return Promise.all([]);
          }
          good.tags = [];
          return Promise.all(tags.map(tagData => (
            Tag.model.findOne(tagData).exec().then(tag => {
              return good.tags.push(tag._id);
            })
          ))).then(() => good.save());
        });
      })
    ).then(() => done());
  });
};
