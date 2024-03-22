const fs = require('fs');
const csv = require('csv-parser');

const readStream = fs.createReadStream('./data/test1.csv');
const writeStream = fs.createWriteStream('./data/clean1.csv');
//write headers
writeStream.write('style_id,photos\n');

let writeObj = {};
const prefix = "https://images.unsplash.com/photo-";
//read,clean, put all on one product_id
readStream
  .pipe(csv())
  .on('data', (row) => {
    //replace thumb and url with smaller string
    let id = parseInt(row.styleId);
    let thumbnail_url = row.thumbnail_url.replace(prefix, "");
    let url = row.url.replace(prefix, "");
    //makesure has beggining and ending quotes
    if (!thumbnail_url.endsWith('"')) {
      thumbnail_url += '"';
    }
    if (!url.endsWith('"')) {
      url +='"';
    }
    //if new id
    if (!writeObj[id]) {
      //if writeObj has a key
      if (Object.keys(writeObj).length > 0) {
        //grab the data and write it into new row and clear data
        let oldId = Object.keys(writeObj)[0];
        //grab all the objects
        let photoPairs = writeObj[oldId].map(pair => `{thumbnail_url:${pair.thumbnail_url},url:${pair.url}}`).join(',');
        writeStream.write(`${oldId},"${photoPairs}"\n`)
      } //then for new data clear obj
      writeObj = {};
      writeObj[id] = [];
    }
    writeObj[id].push({thumbnail_url: thumbnail_url, url: url});
  })
  .on('end', () => {
    if (Object.keys(writeObj).length > 0) {
      let oldId = Object.keys(writeObj)[0];
      let photoPairs = writeObj[oldId].map(pair => `{thumbnail_url:${pair.thumbnail_url},url:${pair.url}}`).join(',');
      writeStream.write(`${oldId},"${photoPairs}"\n`);
    }
    console.log('photos clean complete');
  });