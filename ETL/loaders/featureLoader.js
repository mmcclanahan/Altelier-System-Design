const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const { Product } = require('../../Server/db.js');

mongoose.connect('mongodb://localhost/PROD', { useNewUrlParser: true, useUnifiedTopology: true });
//db.products.explain("executionStats").find({ id: 9999 })


const batchSize = 1000;
let batch = [];
let rowCount = 0;

const stream = fs.createReadStream('data/featuresClean.csv').pipe(csv());
  //async stated so use await for bulkwrite pauses until bulkWrite complete
  stream.on('data', (row) => {
    const productId = parseInt(row.product_id);
    const feature = row.feature;
    const value = row.value;
    batch.push({
      updateOne: {
        filter: { product_id: productId },
        update: { $push: { features: { feature, value } } }
      }
    });
    rowCount++;

    if (batch.length >= batchSize) {
      stream.pause();
      Product.bulkWrite(batch)
      .then(() => {
        console.log(`Processed ${rowCount} rows.`);
        batch = [];
        stream.resume();
      })
      .catch((error) => {
        console.log('ERROR BULK WRITE', error)
        mongoose.connection.close();
      })
    }
  })
  .on('end', async () => {
    if (batch.length > 0) {
      await Product.bulkWrite(batch);
      console.log(`Processed ${rowCount} rows.`);
    }
    console.log('Finished uploading features');
    mongoose.connection.close();
  });