const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const { Product, Style, Feature, StylePhoto, SKU, RelatedProduct } = require('../NoSql/models');

mongoose.connect('mongodb://localhost/PRODUCTS', { useNewUrlParser: true, useUnifiedTopology: true });
//make sure both arrays are lines up in order
const cleanFiles = ['../data/cleanProduct.csv'];
const dbCollections = [Product];

//for each file
cleanFiles.forEach((filePath, index) => {
  const data = [];
  //push rows into data array
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      // matches file index with index of collection and inserts data
      dbCollections[index].insertMany(data)
        .then(() => {
          console.log(`${filePath} inserted into collection ${dbCollections[index].modelName}`);
          if (index === cleanFiles.length - 1) {
            // Close the Mongoose connection after inserting data from the last file
            mongoose.connection.close();
          }
        })
        .catch((err) => {
          console.error(`ERROR from ${filePath} into collection ${dbCollections[index].modelName}--->`, err);
          mongoose.connection.close();
        });
    });
});