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
const KEYS = ['Номер', 'Номер / Артикул', 'PIAA OIL FILTER'];

module.exports = (done) => {
  glob(path.join(dir, '**', '*.json'), (err, filenames) => {
    const tagsByKey = {};
    filenames.forEach(path => {
      JSON.parse(fs.readFileSync(path)).forEach(rec => {
        const recordKeyField = _.find(KEYS, k => rec[k]);
        const recordKey = rec[recordKeyField];
        tagsByKey[recordKey] = Object.keys(rec)
          .filter(key => !IGNORE.includes(key))
          .map(name => ({ name, strValue: rec[name] }));
      });
    });

    console.log(tagsByKey);

    Promise.all(
      _.map(tagsByKey, (tags, good_id) => {
        return Good.model.findOne({ good_id }).exec().then(good => {
          if (!good) {
            return Promise.all([]);
          }
          console.log(good_id, tags);
          return Promise.all(tags.map(tagData => {
            good.tags = [];
            return Tag.model.findOne(tagData).exec().then(tag => {
              good.tags.push(tag._id);
            });
          })).then(() => {
            console.log(good.tags);
            return good.save();
          });
        });
      })
    ).then(() => done());
  });
};
