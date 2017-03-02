var keystone = require('keystone');
var Tag = keystone.list('Tag');
var Good = keystone.list('Good');

const stopwords = [
  'KYK',
  'PIAA',
  'LED',
  'LHD',
  'OEM',
  'NPC',
  'ACEA',
  'SN',
  'CF',
  'PSF',
  'EX',
  'ATF',
  'CVTF',
  'MTF',
  'SAE',
  'ATF',
  'MP',
  'SP',
  'HD',
  'MO',
  'MP',
  'LLC',
  'G',
  'D',
  'LHD',
  'HB',
  'DB',
];

const cap = frag => `${frag[0].toUpperCase()}${frag.slice(1).toLowerCase()}`;

module.exports = (done) => {
  return Good.model.find({}).exec()
    .then(goods => {
      goods.forEach((good, i) => {
        good.name = good.name
          .split(/\s+/)
          .map(frag => {
            if (/^[()А-Яа-я\-]+$/.test(frag)) {
              return i === 0 ? cap(frag) : frag.toLowerCase();
            }
            if (stopwords.indexOf(frag.toUpperCase()) >= 0 || !/^[()A-Za-z]+$/.test(frag)) {
              return frag.toUpperCase();
            }
            return cap(frag);
          })
          .join(' ');
      });
      return Promise.all(goods.map(g => g.save()));
    })
    .then(() => done());
};
