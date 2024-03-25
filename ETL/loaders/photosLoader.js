const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const { StylePhoto } = require('../../Server/db.js');

mongoose.connect('mongodb://localhost/PROD', { useNewUrlParser: true, useUnifiedTopology: true });

const batchSize = 1000;
let batch = [];
let rowCount = 0;
const object = [];
const stream = fs.createReadStream('./data/photoC.csv').pipe(csv())
//each row has an style_id, thumbnail_url, url
//need push to batch if
  stream.on('data', (row) => {
    row.photos = JSON.parse(row.photos);
    batch.push(row);
    rowCount++
    if (batch.length >= batchSize) {
      stream.pause();
      StylePhoto.insertMany(batch)
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
      StylePhoto.insertMany(batch)
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
