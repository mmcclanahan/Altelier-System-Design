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
    for (let key in chunk) {
      if (chunk.hasOwnProperty(key)) {
        chunk[key] = chunk[key].trim();
      }
    }
    chunk.session = chunk.user_session;
    chunk.sku_id = chunk.product_id;
    chunk.active = chunk.active === '1' ? true: false;

    chunk = csvStringifier.stringifyRecords([chunk]);
    this.push(chunk);
    next();
  }
}

// define the CSV stringifier for headers
const csvStringifier = createCsvStringifier({
  header: [
    { id: "session", title: "session" },
    { id: "sku_id", title: "sku_id" },
    { id: "active", title: "active" }
  ]
});

// define paths for the read and write streams
let readStream = fs.createReadStream("./data/cart.csv");
let writeStream = fs.createWriteStream("./data/cartC.csv");

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
    console.log("cart cleaning finished.");
  });