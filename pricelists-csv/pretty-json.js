const path = require("path");
const glob = require("glob");
const fs = require("fs");
const _ = require('lodash');

const dir = 'json/';

glob(path.join(dir, '**', '*.json'), (err, filenames) => {
  filenames.forEach(path => {
    const obj = JSON.parse(fs.readFileSync(path))
      .filter(item => _.values(item).some(v => !!v));
    fs.writeFileSync(path, JSON.stringify(obj, null, '  '));
  });
});
