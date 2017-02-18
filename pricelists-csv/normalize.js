const path = require("path");
const glob = require("glob");
const node_xj = require("xls-to-json");

const inDir = 'xls/';
const outDir = 'json/';

glob(path.join(inDir, '**', '*.xlsx'), (err, filenames) => {
  filenames.forEach(input => {
    const output = path.join(outDir, input.replace(`${inDir}/`, '').replace('xlsx', 'json'))
    node_xj({ input, output }, (err, result) => {
      if(err) {
        console.error(err);
      } else {
        console.log(result);
      }
    });
  });
});
