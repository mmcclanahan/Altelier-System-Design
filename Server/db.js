require("dotenv").config();
const mongoose = require('mongoose');

//for aws
const mongoURL = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.URL}:${process.env.PORT}/${process.env.DB_NAME}?authSource=admin`;
//for local testing
//const mongoURL = `mongodb://localhost:27017/PROD`

const db = mongoose.connect(mongoURL)
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to the database');
});

module.exports = db;


//first connect to aws then connect to port
  const productSchema = mongoose.Schema({
      product_id: { type: Number, required: true, unique: true, index: true},
      name: String,
      slogan: String,
      description: String,
      category: String,
      default_price: Number,
      features: []
  });
  const styleSchema = mongoose.Schema({
      style_id: Number,
      product_id: {type: Number, index: true},
      name: String,
      sale_price: String,
      original_price: String,
      default_style: Boolean
  });
  const stylePhotoSchema = new mongoose.Schema({
    style_id: {type: Number, index: true},
    photos: [{
      thumbnail_url: String,
      url: String
    }]
  });
  const skuSchema = new mongoose.Schema({
    style_id: {type: Number, index: true},
    skus:[{
      skuNumber: String,
      size: String,
      quantity: Number
    }]
  });
  const relatedProductsSchema =  mongoose.Schema({
      product_id: {type: Number, index: true, unique: true},
      related_ids: [Number]
  });
  const cartSchema = mongoose.Schema({
    session: Number,
    sku_id: Number,
    active: Boolean
  });
  //models
  module.exports = {
    Product: mongoose.model('Product', productSchema),
    Style: mongoose.model('Style', styleSchema),
    StylePhoto: mongoose.model('StylePhoto', stylePhotoSchema),
    SKU: mongoose.model('SKU', skuSchema),
    RelatedProduct: mongoose.model('RelatedProduct', relatedProductsSchema),
    Cart: mongoose.model('Cart', cartSchema),
  };

