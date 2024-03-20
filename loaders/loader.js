const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const { Product } = require('./NoSql/models');

mongoose.connect('mongodb://localhost/PRODUCTS', { useNewUrlParser: true, useUnifiedTopology: true });

const data = [];

fs.createReadStream('../data/cleanProduct.csv')
  .pipe(csv())
  .on('data', (row) => {
    //can transform here trying a different file first
    //add row to data array
    data.push(row);
  })
  .on('end', () => {
    //on end insert data into models
    Product.insertMany(data)
      .then(() => {
        console.log('INSERT SUCCESFUL');
        mongoose.connection.close();
      })
      .catch((err) => {
        console.error('ERROR ERROR ERROR', err);
        mongoose.connection.close();
      });
  });
