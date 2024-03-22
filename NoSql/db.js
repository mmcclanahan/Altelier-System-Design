const mongoose = require('mongoose');
const { Product, Feature, Style, StylePhoto, SKU, RelatedProduct } = require('./denormModels');
//this isnt needed when i load data it will create a PRODUCTS db and the schema is imported and used to create collections will happen in the load All
mongoose.connect('mongodb://localhost/PRODUCTS')
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch((err) => {
    console.log('ERROR CONNECTING TO MONGODB', err)
  })
//dummy data
const productData = {
  product_id: 1,
  name: 'Sample Product',
  slogan: 'A catchy slogan',
  description: 'Description of the product',
  category: 'Sample Category',
  default_price: '20.00'
};

const featureData = [
  { product_id: 1, feature: 'Color', value: 'Blue' },
  { product_id: 1, feature: 'Size', value: 'Medium' },
];
const styleData = {
  style_id: 1,
  product_id: 1,
  name: 'Default Style',
  original_price: '25.00',
  sale_price: '20.00',
  is_default: true
};
const stylePhotoData = {
  style_id: 1,
  thumbnail_url: 'thumbnail_url.jpg',
  url: 'url.jpg'
};
const skuData = {
  skuNumber: 'SKU001',
  quantity: 10,
  size: 'M'
};
const relatedProductData = {
  product_id: 1,
  related_products: 2
};
//end of dummy data
//insert into database
async function insertDummyData() {
  try {
      await Product.create(productData);
      await Feature.insertMany(featureData);
      await Style.create(styleData);
      await StylePhoto.create(stylePhotoData);
      await SKU.create(skuData);
      await RelatedProduct.create(relatedProductData);
      console.log('inserted');
  } catch (error) {
      console.error('error', error);
  }
}
//insertDummyData();