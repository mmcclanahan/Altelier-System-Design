require("dotenv").config();
const mongoose = require('mongoose');

mongoose.connect(`${process.env.URL}`)
  .then(() => {
    console.log(`connected to mongodb db: ${process.env.DB_NAME}`)
  })
  .catch((err) => {
    console.log('ERROR CONNECTING TO MONGODB', err)
  })
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

