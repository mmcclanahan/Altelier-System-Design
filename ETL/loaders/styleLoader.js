const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const { Style } = require('../../NoSql/denormModels');

mongoose.connect('mongodb://localhost/PRODUCTS', { useNewUrlParser: true, useUnifiedTopology: true });

const batchSize = 1000;
let batch = [];
let rowCount = 0;
//could change end to just close the connection
//and documents for each row as iits piped through instead of all at once on end
const stream = fs.createReadStream('data/stylesC.csv').pipe(csv())

  stream.on('data', (row) => {
    //add row to data array
    batch.push(row);
    rowCount++
    if (batch.length >= batchSize) {
      stream.pause();
      Style.insertMany(batch)
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
      Style.insertMany(batch)
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
