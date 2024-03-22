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
    // Clean and transform the data here
    // Example: Remove whitespace and filter out non-numeric characters
    // Write the cleaned data to the output stream
    // Call the callback function to proceed to the next chunk
    for (let key in chunk) {
      // Trims whitespace
      let trimKey = key.trim();
      chunk[trimKey] = chunk[key];
      if (key !== trimKey) {
        delete chunk[key];
      }
    }
    // filters out all non-number characters
    let onlyNumbers = chunk.original_price.replace(/\D/g, "");
    chunk.original_price = onlyNumbers;
    // convert default_style to boolean
    chunk.default_style = chunk.default_style === '1';
    //this is changing the original id header to product_id making sure the id is not left out just mapped to product_id
    chunk.style_id = chunk.id;
    chunk.product_id = chunk.productId;
    delete chunk.productId;
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
    { id: "style_id", title: "style_id"},
    { id: "product_id", title: "product_id" },
    { id: "name", title: "name" },
    { id: "sale_price", title: "sale_price" },
    { id: "original_price", title: "original_price" },
    { id: "default_style", title: "default_style" }
  ],
});

// define paths for the read and write streams
let readStream = fs.createReadStream("./data/stylestest.csv");
let writeStream = fs.createWriteStream("./data/cleanStyleTest.csv");

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