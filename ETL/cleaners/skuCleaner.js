//nests all thumbnail and url for a id into photos header
const fs = require('fs');
const csv = require('csv-parser');

const readStream = fs.createReadStream('./data/skus.csv');
const writeStream = fs.createWriteStream('./data/skusClean.csv');
//write headers
writeStream.write('style_id,skus\n');

let writeObj = {};
//read,clean, put all on one product_id
readStream
  .pipe(csv())
  .on('data', (row) => {
    //trim whitespace
    for (let key in row) {
      if (row.hasOwnProperty(key)) {
        row[key] = row[key].trim();
      }
    }
    //grab the columns
    let id = parseInt(row.styleId);
    let skuNumber = row.id;
    let size = row.size;
    let quantity = row.quantity;
    //if new id
    if (!writeObj[id]) {
      //if writeObj has a key
      if (Object.keys(writeObj).length > 0) {
        //grab the data and write it into new row and clear data
        let oldId = Object.keys(writeObj)[0];
        //grab all the objects
        let skuObjects = writeObj[oldId].map(obj => `{""skuNumber"":""${obj.skuNumber}"",""size"":""${obj.size}"",""quantity"":""${obj.quantity}""}`).join(',');
        //removed quotes around skuObjects
        writeStream.write(`${oldId},"[${skuObjects}]"\n`)
      } //then for new data clear obj
      writeObj = {};
      writeObj[id] = [];
    }
    writeObj[id].push({skuNumber: skuNumber, size: size, quantity: quantity});
  })
  .on('end', () => {
    if (Object.keys(writeObj).length > 0) {
      let oldId = Object.keys(writeObj)[0];
      let skuObjects = writeObj[oldId].map(obj => `{""skuNumber"":""${obj.skuNumber}"",""size"":""${obj.size}"",""quantity"":""${obj.quantity}""}`).join(',');
        //removed quotes around skuObjects
      writeStream.write(`${oldId},"[${skuObjects}]"\n`)
    }
    console.log('sku clean complete');
  });



