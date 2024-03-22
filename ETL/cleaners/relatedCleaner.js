const fs = require('fs');
const csv = require('csv-parser');

const readStream = fs.createReadStream('./data/related.csv');
const writeStream = fs.createWriteStream('./data/relatedClean.csv');
//write headers
writeStream.write('product_id,related_ids\n');

let productRelatedIds = {};

//read,clean, put all on one product_id
readStream
  .pipe(csv())
  .on('data', (row) => {
    const productId = parseInt(row.current_product_id);
    const relatedId = parseInt(row.related_product_id);
    //if its a new productId write the old one and clear the object
    if (!productRelatedIds[productId]) {
      //get the prior productId and its related ids and write
      if (Object.keys(productRelatedIds).length > 0) {
        let id = Object.keys(productRelatedIds)[0];
        let array = productRelatedIds[id].join(',');
        writeStream.write(`${id},"${array}"\n`)
      }
      productRelatedIds = {};
      productRelatedIds[productId] = [];
    }
    if (relatedId !== 0 && relatedId !== productId && !productRelatedIds[productId].includes(relatedId)) {
      //push relatedId into array
      productRelatedIds[productId].push(relatedId)
    }
  })
  .on('end', () => {
    if (Object.keys(productRelatedIds).length > 0) {
      const id = Object.keys(productRelatedIds)[0];
      const array = productRelatedIds[id].join(',');
      writeStream.write(`${id},"${array}"\n`);
    }
    console.log('related clean complete');
  });