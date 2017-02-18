var keystone = require('keystone');
var Tag = keystone.list('Tag');

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

module.exports = (done) => {
  glob(path.join(dir, '**', '*.json'), (err, filenames) => {
    const tags = {};
    filenames.forEach(path => {
      JSON.parse(fs.readFileSync(path)).forEach(rec => {
        Object.keys(rec)
          .filter(key => !IGNORE.includes(key))
          .forEach(key => {
            const val = rec[key];
            tags[key] = tags[key] || {};
            tags[key][val] = val;
          });
      });
    });

    const serial = _.reduce(tags, (acc, vals, name) => (
      acc.concat(_.values(vals).map(strValue => ({ name, strValue })))
    ), []);

    console.log(filenames, tags, serial);

    Promise.all(serial.map(tagData => Tag.model.create(tagData)))
      .then(() => done());
  });
};
