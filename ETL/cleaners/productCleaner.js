// Import the necessary modules
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;
const fs = require('fs');
const csv = require("csv-parser");
const Transform = require("stream").Transform;

// define the CSV cleaner class
class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
  }
  _transform(chunk, encoding, next) {
    //trim whitespace
    for (let key in row) {
      if (row.hasOwnProperty(key)) {
        row[key] = row[key].trim();
      }
    }
    // filters out all non-number characters
    let onlyNumbers = chunk.default_price.replace(/\D/g, "");
    chunk.default_price = onlyNumbers;
    //this is changing the original id header to product_id making sure the id is not left out just mapped to product_id
    chunk.product_id = chunk.id;
    delete chunk.id;
    // uses our csvStringifier to turn our chunk into a csv string
    chunk = csvStringifier.stringifyRecords([chunk]);
    this.push(chunk);
    next();
  }
}

// define the CSV stringifier for headers
const csvStringifier = createCsvStringifier({
  header: [
    { id: "product_id", title: "product_id" },
    { id: "name", title: "name" },
    { id: "slogan", title: "slogan" },
    { id: "description", title: "description" },
    { id: "category", title: "category" },
    { id: "default_price", title: "default_price" },
  ],
});

// define paths for the read and write streams
let readStream = fs.createReadStream("./data/product.csv");
let writeStream = fs.createWriteStream("./data/productClean.csv");

// create an instance of the CSV cleaner with writable object mode set to true
const transformer = new CSVCleaner({ writableObjectMode: true });

// write the header to the output CSV file
writeStream.write(csvStringifier.getHeaderString());

// pipe the read stream through the CSV parser, transformer, and write stream
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on("finish", () => {
    console.log("Data cleaning finished.");
  });