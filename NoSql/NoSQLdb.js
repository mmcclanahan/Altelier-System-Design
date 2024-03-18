require('dotenv').config();
const mongoose = require('mongoose');

//mongoose.connect()
const ProductSchema = mongoose.Schema({
    id: Number,
    name: String,
    slogan: String,
    description: String,
    category: String,
    default_price: Number,
});

const StyleSchema = mongoose.Schema({
    product_id: Number,
    name: String,
    original_price: Number,
    sale_price: Number,
    is_default: Boolean,
    photos: [{
        thumbnail_url: String,
        url: String
    }],
    skus: [{
        quantity: Number,
        size: String
    }]
});

const RelatedProductsSchema =  mongoose.Schema({
    product_id: Number,
    related_products: [Number]
});

