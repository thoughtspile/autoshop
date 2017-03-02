const imagemin = require('imagemin');
const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs-promise');
const imageminMozjpeg = require('imagemin-mozjpeg');
const path = require('path');

const out = './public/images/goods/';

// imagemin(['./public/images/goods/original/*.{jpg,png}'], './public/images/goods/', {
//     plugins: [
//         imageminMozjpeg({ quality: 90 }),
//     ]
// }).then(files => {

glob('./public/images/goods/original/*.jpg', function (er, fileNames) {
  const proceed = () => {
    console.log(fileNames.length, 'to go');
    const fileName = fileNames.pop();
    if (!fileName) return;

    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const outPath = path.join(out, `${baseName}.thumb${ext}`);

    fs.readFile(fileName)
      .then((buff) => (
        sharp(buff)
          // .blur(.6)
          .resize(200, 200)
          .max()
          .toFormat('jpeg', { quality: 92 })
          .toBuffer()
      ))
      .then(outBuffer => fs.writeFile(outPath, outBuffer))
      .then(proceed);
  };
  proceed();
});
// });
