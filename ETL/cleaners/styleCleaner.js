//nests all thumbnail and url for a id into photos header
const fs = require('fs');
const csv = require('csv-parser');

const readStream = fs.createReadStream('./data/styles.csv');
const writeStream = fs.createWriteStream('./data/stylesC.csv');
//write headers
writeStream.write('product_id,style_id,name,sale_price,original_price,default_style\n');

readStream
  .pipe(csv())
  .on('data', (row) => {
    //trim whitespace
    for (let key in row) {
      if (row.hasOwnProperty(key)) {
        row[key] = row[key].trim();
      }
    }
    let style_id = row.id;
    let product_id = row.productId;
    writeStream.write(`${product_id},${style_id},"${row.name}",${row.sale_price},${row.original_price},${row.default_style}\n`)
  })
  .on('end', () => {
    console.log('style clean complete');
  });

