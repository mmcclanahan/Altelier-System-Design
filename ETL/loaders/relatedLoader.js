const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const { RelatedProduct } = require('../../Server/db.js');

mongoose.connect('mongodb://localhost/PROD', { useNewUrlParser: true, useUnifiedTopology: true });

const batchSize = 1000;
let batch = [];
let rowCount = 0;

const stream = fs.createReadStream('data/relatedClean.csv').pipe(csv())

  stream.on('data', (row) => {
    //add row to data array
    //remove the quotes
    const relatedIds = row.related_ids.split(',').map(Number);
    row.related_ids = relatedIds;
    batch.push(row);
    rowCount++
    if (batch.length >= batchSize) {
      stream.pause();
      RelatedProduct.insertMany(batch)
      .then(() => {
        //reset batch and count
        console.log(`inserted ${rowCount} rows`)
        batch=[];
        stream.resume()
      })
      .catch((err) => {
        console.log('ERROR', err)
        mongoose.connection.close()
      })
    }
  })
  stream.on('end', () => {
    //on end insert data into models
    if (batch.length > 0) {
      RelatedProduct.insertMany(batch)
        .then(() => {
          console.log('Last Insert successful');
          mongoose.connection.close();
        })
        .catch((err) => {
          console.error('ERROR ERROR ERROR', err);
          mongoose.connection.close();
        });
    } else {
      mongoose.connection.close();
    }
  });
