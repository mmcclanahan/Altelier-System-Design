const fs = require('fs');
const readline = require('readline');
//https://images.unsplash.com/
////Stop

///Stop


///Stop /***STOP */
  const readStream = fs.createReadStream('./data/photos.csv');
  const writeStream = fs.createWriteStream('./data/photosP.csv');

  // Create an interface to read the file line by line
  const rl = readline.createInterface({
    input: readStream,
    output: process.stdout,
    terminal: false
  });
  rl.on('line', (line) => {
    // remove u and domain
    line = line.replace(/u?https:\/\/images\.unsplash\.com\//g, '');
    //add missing quotes to urls that dont have closing quote
    line = line.replace(/"/g, '');
    //write processed line
    writeStream.write(`${line}\n`);
  });
  rl.on('close', () => {
    writeStream.end();
    console.log('CSV preprocessing complete.');
  });
