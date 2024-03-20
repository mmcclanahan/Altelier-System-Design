const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'PRODUCTS'
})
//start of mock data
const productData = {
  product_id: 40344,
  name: 'Sample Product',
  slogan: 'A catchy slogan',
  description: 'Description of the product',
  category: 'Sample Category',
  default_price: '20.00'
};

const styleData = {
  style_id: 1,
  product_id: 40344,
  name: 'Default Style',
  original_price: '25.00',
  sale_price: '20.00',
  is_default: 1
};

const featuresData = [
  { product_id: 40344, feature: 'Color', value: 'Blue' },
  { product_id: 40344, feature: 'Size', value: 'Medium' }
];

const photosData = [
  { style_id: 1, thumbnail_url: 'thumbnail_url1.jpg', url: 'url1.jpg' },
  { style_id: 1, thumbnail_url: 'thumbnail_url2.jpg', url: 'url2.jpg' }
];

const skusData = [
  { style_id: 1, skuNumber: 'SKU001', quantity: 10, size: 'M' },
  { style_id: 1, skuNumber: 'SKU002', quantity: 5, size: 'L' }
];
/*
const relatedProductsData = [
  { product_id: 1, related_product_id: 2 },
  { product_id: 1, related_product_id: 3 }
];*/
//end of mock data
//product
//category table?
//mostly getting a specific produc tby id and getting its styles, photos, skus and features
//every customer is gonna load a products details
//might have to change data model based on whats taking the most query load
//normalalization can store in
//think of a document with keys shipTO adress could be stored instead in user document
//database thats denormalized for fast look up
//database for normalized for writing
//index if id is indexed data structure with constant time
db.query('INSERT INTO Products SET ?', productData, (err, result) => {
  if (err) {
    console.error('err product', err);
    return;
  }
  //style
  db.query('INSERT INTO ProductStyles SET ?', styleData, (err, result) => {
    if (err) {
      console.error('Style err', err);
      return;
    }
    //features
    featuresData.forEach(feature => {
      db.query('INSERT INTO Features SET ?', feature, (err) => {
        if (err) console.error('feature err', err);
      });
    });
    //photos
    photosData.forEach(photo => {
      db.query('INSERT INTO StylePhotos SET ?', photo, (err) => {
        if (err) console.error('photo err', err);
      });
    });
    // SKUs
    skusData.forEach(sku => {
      db.query('INSERT INTO SKUs SET ?', sku, (err) => {
        if (err) console.error('SKU err:', err);
      });
    });
    console.log('inserted all data');
  });
});


/*  related products data
relatedProductsData.forEach(relatedProduct => {
  db.query('INSERT INTO RelatedProducts SET ?', relatedProduct, (err) => {
    if (err) console.error('Error inserting related product:', err);
  });
});*/